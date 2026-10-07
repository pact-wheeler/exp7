/*
 * Hover previews for internal links (Jekyll + Tufte CSS layout).
 * - Desktop only (devices with a real hover pointer)
 * - Only links inside the post body (<article>) get previews; nav/footer don't
 * - 400 ms delay before opening, 200 ms grace period on leaving
 * - Shows the whole post in a scrollable box
 * - Vega/Vega-Lite charts replaced with a placeholder
 */
(function () {
  "use strict";

  // ---- Settings -----------------------------------------------------------
  var OPEN_DELAY = 400;        // ms before the preview opens
  var CLOSE_DELAY = 200;       // ms grace period to move into the box
  var WIDTH = 500;             // px
  var MAX_HEIGHT = 400;        // px
  var SCOPE_SELECTOR = "article";                    // only links inside this get previews
  var CONTENT_SELECTORS = ["article > section", "article"]; // first match wins
  var TITLE_SELECTOR = "article > h1";
  var CHART_SELECTORS = [".vega-chart", "[data-vega]"]; // extra chart containers, if you use any
  var PLACEHOLDER_TEXT = "Open post to view chart";
  var SKIP_EXTENSIONS = /\.(csv|json|png|jpe?g|gif|svg|webp|pdf|zip|xml|txt)$/i;

  // ---- Desktop only -------------------------------------------------------
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  // ---- Styles -------------------------------------------------------------
  // Base box styles, then overrides for Tufte CSS rules that assume a wide
  // page (55%-width paragraphs, sidenotes floated into the right margin,
  // very large headings) and would break inside a 500px box.
  var css =
    ".lp-box{position:absolute;z-index:1000;width:" + WIDTH + "px;max-width:calc(100vw - 32px);" +
    "max-height:" + MAX_HEIGHT + "px;overflow-y:auto;background:#fffff8;color:#111;" +
    "border:1px solid #ddd;border-radius:6px;box-shadow:0 6px 24px rgba(0,0,0,.15);" +
    "padding:16px 20px;display:none}" +
    ".lp-box.lp-open{display:block}" +
    // Tufte layout overrides
    ".lp-box section{padding:0}" +
    ".lp-box p,.lp-box ul,.lp-box ol,.lp-box table,.lp-box blockquote,.lp-box figure,.lp-box pre," +
    ".lp-box section>*{width:auto;max-width:100%;margin-right:0}" +
    ".lp-box p,.lp-box li,.lp-box blockquote,.lp-box td,.lp-box th{font-size:1.1rem;line-height:1.5}" +
    ".lp-box .sidenote,.lp-box .marginnote{float:none;display:block;width:auto;max-width:none;" +
    "margin:.4em 0 .4em 1.5em;font-size:.95rem;color:#666}" +
    ".lp-box h1.lp-title{font-size:1.8rem;line-height:1.2;margin:0 0 .6em;font-weight:400}" +
    ".lp-box h2{font-size:1.5rem;margin-top:1.2em}" +
    ".lp-box h3{font-size:1.3rem;margin-top:1em}" +
    ".lp-box img{max-width:100%;height:auto}" +
    ".lp-box pre{overflow-x:auto}" +
    // Placeholder + loading text
    ".lp-placeholder{border:1px dashed #bbb;border-radius:4px;padding:24px;text-align:center;" +
    "color:#666;font-style:italic;margin:1em 0;font-size:1.1rem}" +
    ".lp-status{color:#888;font-style:italic}" +
    "@media (prefers-color-scheme:dark){.lp-box{background:#151515;color:#ddd;border-color:#444}" +
    ".lp-box .sidenote,.lp-box .marginnote{color:#aaa}" +
    ".lp-placeholder{border-color:#555;color:#aaa}}";
  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---- State --------------------------------------------------------------
  var box = document.createElement("div");
  box.className = "lp-box";
  document.body.appendChild(box);

  var cache = {};          // url -> Promise<DocumentFragment-ish HTML string>
  var openTimer = null;
  var closeTimer = null;
  var currentLink = null;

  // ---- Helpers ------------------------------------------------------------
  function isPreviewable(a) {
    if (!a || !a.href) return false;
    if (box.contains(a)) return false;                         // no previews inside the box
    if (!a.closest(SCOPE_SELECTOR)) return false;               // skip nav, footer
    if (a.target === "_blank" && a.origin !== location.origin) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;           // internal only
    if (url.pathname === location.pathname) return false;       // same page / anchors
    if (SKIP_EXTENSIONS.test(url.pathname)) return false;       // files, not posts
    return true;
  }

  function pageKey(href) {
    var u = new URL(href, location.href);
    u.hash = "";
    return u.href;
  }

  // Make relative src/href inside fetched content resolve against the fetched page
  function absolutize(root, baseUrl) {
    root.querySelectorAll("[src]").forEach(function (el) {
      el.setAttribute("src", new URL(el.getAttribute("src"), baseUrl).href);
    });
    root.querySelectorAll("[href]").forEach(function (el) {
      el.setAttribute("href", new URL(el.getAttribute("href"), baseUrl).href);
    });
  }

  function makePlaceholder() {
    var p = document.createElement("div");
    p.className = "lp-placeholder";
    p.textContent = PLACEHOLDER_TEXT;
    return p;
  }

  // Replace chart containers. Finds targets of vegaEmbed("#id", ...) calls
  // plus anything matching CHART_SELECTORS, then strips all scripts.
  function replaceCharts(content, doc) {
    var targets = [];
    doc.querySelectorAll("script").forEach(function (s) {
      var re = /vegaEmbed\(\s*['"]([^'"]+)['"]/g;
      var m;
      while ((m = re.exec(s.textContent)) !== null) targets.push(m[1]);
    });
    targets.concat(CHART_SELECTORS).forEach(function (sel) {
      var els;
      try { els = content.querySelectorAll(sel); } catch (e) { return; }
      els.forEach(function (el) { el.replaceWith(makePlaceholder()); });
    });
    content.querySelectorAll("script, noscript").forEach(function (s) { s.remove(); });
  }

  function load(href) {
    var key = pageKey(href);
    if (!cache[key]) {
      cache[key] = fetch(key, { credentials: "same-origin" })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, "text/html");
          var content = null;
          for (var i = 0; i < CONTENT_SELECTORS.length && !content; i++) {
            content = doc.querySelector(CONTENT_SELECTORS[i]);
          }
          if (!content) throw new Error("no content");
          replaceCharts(content, doc);
          absolutize(content, key);

          var wrap = document.createElement("div");
          var titleEl = doc.querySelector(TITLE_SELECTOR) || doc.querySelector("title");
          if (titleEl) {
            var h = document.createElement("h1");
            h.className = "lp-title";
            h.textContent = titleEl.textContent.trim();
            wrap.appendChild(h);
          }
          wrap.appendChild(document.importNode(content, true));
          return wrap.innerHTML;
        })
        .catch(function (err) {
          delete cache[key];              // allow retry later
          throw err;
        });
    }
    return cache[key];
  }

  function position(link) {
    var r = link.getBoundingClientRect();
    var gap = 8;
    var boxH = Math.min(box.scrollHeight, MAX_HEIGHT);
    var boxW = box.offsetWidth;

    // Below the link, or above if there isn't room
    var top = r.bottom + gap;
    if (top + boxH > window.innerHeight && r.top - gap - boxH > 0) {
      top = r.top - gap - boxH;
    }
    // Align with the link, clamped to the viewport
    var left = Math.min(Math.max(16, r.left), window.innerWidth - boxW - 16);

    box.style.top = top + window.scrollY + "px";
    box.style.left = left + window.scrollX + "px";
  }

  function show(link) {
    currentLink = link;
    box.innerHTML = '<p class="lp-status">Loading…</p>';
    box.scrollTop = 0;
    box.classList.add("lp-open");
    position(link);

    load(link.href).then(function (html) {
      if (currentLink !== link) return;   // user moved on
      box.innerHTML = html;
      box.scrollTop = 0;
      position(link);
    }, function () {
      if (currentLink !== link) return;
      hide();
    });
  }

  function hide() {
    currentLink = null;
    box.classList.remove("lp-open");
    box.innerHTML = "";
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(hide, CLOSE_DELAY);
  }

  // ---- Events -------------------------------------------------------------
  document.addEventListener("mouseover", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!isPreviewable(a)) return;
    clearTimeout(closeTimer);
    if (a === currentLink) return;
    clearTimeout(openTimer);
    openTimer = setTimeout(function () { show(a); }, OPEN_DELAY);
  });

  document.addEventListener("mouseout", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!isPreviewable(a)) return;
    if (a.contains(e.relatedTarget)) return;   // still inside the link
    clearTimeout(openTimer);
    if (currentLink) scheduleClose();
  });

  box.addEventListener("mouseenter", function () { clearTimeout(closeTimer); });
  box.addEventListener("mouseleave", scheduleClose);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { clearTimeout(openTimer); hide(); }
  });
  window.addEventListener("scroll", function () {
    if (currentLink && !box.matches(":hover")) hide();
  }, { passive: true });
})();

/**
 * Converts kramdown footnotes to Tufte-style sidenotes
 * Based on the approach from https://kau.sh/blog/jekyll-footnote-tufte-sidenote/
 */

(function() {
  'use strict';

  function convertFootnotesToSidenotes() {
    // Find all footnote references in the text
    const footnoteRefs = document.querySelectorAll('a.footnote');
    
    if (footnoteRefs.length === 0) return;

    // Find the footnotes container
    const footnotesDiv = document.querySelector('.footnotes');
    if (!footnotesDiv) return;

    // Get all footnote items
    const footnoteItems = footnotesDiv.querySelectorAll('li[id^="fn:"]');

    footnoteRefs.forEach((ref, index) => {
      // Get the corresponding footnote content
      const footnoteId = ref.getAttribute('href').substring(1); // Remove the '#'
      const footnoteItem = document.getElementById(footnoteId);
      
      if (!footnoteItem) return;

      // Clone the footnote content
      const footnoteContent = footnoteItem.querySelector('p');
      if (!footnoteContent) return;

      // Remove the back reference link (↩)
      const backRef = footnoteContent.querySelector('.reversefootnote');
      if (backRef) backRef.remove();

      // Create the sidenote structure
      const sidenoteNumber = document.createElement('label');
      sidenoteNumber.className = 'sidenote-number';
      sidenoteNumber.setAttribute('for', 'sn-' + index);

      const sidenoteCheckbox = document.createElement('input');
      sidenoteCheckbox.type = 'checkbox';
      sidenoteCheckbox.id = 'sn-' + index;
      sidenoteCheckbox.className = 'margin-toggle';

      const sidenote = document.createElement('span');
      sidenote.className = 'sidenote';
      sidenote.innerHTML = footnoteContent.innerHTML;

      // Replace the footnote reference with the sidenote structure
      const parent = ref.parentNode;
      
      // Remove the original footnote reference
      ref.remove();

      // Insert the sidenote elements
      parent.appendChild(sidenoteNumber);
      parent.appendChild(sidenoteCheckbox);
      parent.appendChild(sidenote);
    });

    // Remove the original footnotes section
    footnotesDiv.remove();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', convertFootnotesToSidenotes);
  } else {
    convertFootnotesToSidenotes();
  }
})();
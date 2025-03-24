---
layout: default
title: Home
---

Welcome to my blog!

{% assign postsByYearMonth = site.posts | group_by_exp:"post", "post.date | date: '%B %Y'" %}
{% for yearMonth in postsByYearMonth %}
  <h2>{{ yearMonth.name }}</h2>
  <ul>
    {% for post in yearMonth.items %}
      <li>
        <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> - {{ post.date | date: "%B %d, %Y" }}
      </li>
    {% endfor %}
  </ul>
{% endfor %}

[Browse by Tag]({{ site.baseurl }}/tags.html)
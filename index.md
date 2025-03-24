---
layout: default
title: Home
---

Welcome to my blog!

{% for post in site.posts %}
  {% assign currentdate = post.date | date: "%B %Y" %}
  {% if currentdate != date %}
    {% unless forloop.first %}</ul>{% endunless %}
    <h2 id="{{ post.date | date: '%Y-%m' }}">{{ currentdate }}</h2>
    <ul>
    {% assign date = currentdate %}
  {% endif %}
    <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> - {{ post.date | date: "%B %d, %Y" }}</li>
  {% if forloop.last %}</ul>{% endif %}
{% endfor %}

[Browse by Tag]({{ site.baseurl }}/tags.html)
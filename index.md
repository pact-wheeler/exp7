---
layout: default
title: Home
---

Welcome to my blog!

## Recent Posts

{% for post in site.posts limit:5 %}
* [{{ post.title }}]({{ site.baseurl }}{{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}
---
layout: default
title: Home
---

My name is Daniel, welcome! Below, my posts are in roughly chronological order. If you want to see them by tag, click, [here.]({{ site.baseurl }}/tags.html)

My writing follows no particular order or sense, I publish it as it occurs to me.

{% assign visible_posts = site.posts | where_exp: "post", "post.hidden != true" %}
{% assign postsByYearMonth = visible_posts | group_by_exp:"post", "post.date | date: '%B %Y'" %}
{% for yearMonth in postsByYearMonth %}
**{{ yearMonth.name }}**
{% for post in yearMonth.items %}
* [{{ post.title }}]({{ post.url }}) <small>{{ post.date | date: "%B %d, %Y" }} | {{ post.tags | join: ", " }}</small>
{% endfor %}
{% endfor %}

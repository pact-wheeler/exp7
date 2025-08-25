---
layout: default
title: Home
---

My name is Daniel, welcome! Below, my posts are in roughly chronological order. If you want to see them by tag, click, [here.]({{ site.baseurl }}/tags.html)

My writing includes essays on faith, business expertise, data and some fiction. Feel free to reach out at me@ the url of this page.

{% assign postsByYearMonth = site.posts | group_by_exp:"post", "post.date | date: '%B %Y'" %} {% for yearMonth in postsByYearMonth %} **{{ yearMonth.name }}** {% for post in yearMonth.items %} * [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }} {% endfor %} {% endfor %}

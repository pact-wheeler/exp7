---
layout: default
title: Home
---
My name is Daniel, welcome! Below, my posts are in roughly chronological order. If you want to see them by tag, click, [here.]({{ site.baseurl }}/tags.html)

{% assign visible_posts = site.posts | where_exp: "post", "post.hidden == nil or post.hidden == false" %}
{% assign postsByYearMonth = visible_posts | group_by_exp:"post", "post.date | date: '%B %Y'" %}
{% for yearMonth in postsByYearMonth %}
**{{ yearMonth.name }}**
{% for post in yearMonth.items %}
{% assign word_count = post.content | number_of_words %}

* [{{ post.title }}]({{ post.url }}) <small>{{ post.date | date: "%B %d, %Y" }} | {{ post.tags | join: ", " }}{% if word_count < 750 %}, short{% endif %}</small>
{% endfor %}
{% endfor %}
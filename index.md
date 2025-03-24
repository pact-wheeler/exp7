---
layout: default
title: Home
---

My name is Daniel, welcome to my blog! Below, my posts are in roughly chronological order below. If you want to see them by tag, click, [here.]({{ site.baseurl }}/tags.html)

I am a freelance consultant who works with construction companies. I love helping owners figure out how to use their data, without another subscription. In the past, I've worked in manufacturing and I do have clients who have retail shops and financial advising.

My writing spans faith, business expertise, and fiction. Feel free to reach out at me@ the url of this page.

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


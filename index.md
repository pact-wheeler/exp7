---
layout: default
title: Home
---

My name is Daniel, welcome! Below, my posts are in roughly chronological order. If you want to see them by tag, click, [here.]({{ site.baseurl }}/tags.html)

My company is Kurjen, I work with construction companies. I love helping owners figure out how to use their data, without another subscription. Besides construction companies, I have some local clients in the retail space and financial advising. Scroll to the bottom of my business page to see most of the companies I've worked with.

My writing includes essays on faith, business expertise, data and some fiction. Feel free to reach out at me@ the url of this page.

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


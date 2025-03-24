---
layout: default
title: Home
---

My name is Daniel, welcome to my blog! Below, my posts are in roughly chronological order,[here]({{ site.baseurl }}/tags.html), they're by tag. 

I am a freelance consultant that mostly works with construction companies though I've worked in manufacturing, I have clients who have retail shops, and financial advising. I love helping owners figure out how to use their data, without another subscription.

My writing spans my faith, business expertise, and fiction. Feel free to reach out at me@ the url of this page.

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


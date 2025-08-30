---
layout: page
title: About
permalink: /about/
weight: 3
---

# About Me

Hi, I am **{{ site.author.name }}** :wave:

Backend Developer with 4+ years of experience. While I have worked in Frontend and Fullstack roles, my true expertise lies in Backend development: I specialize in building scalable architectures, developing robust systems, and efficiently managing high-volume data.

My skills extend to cloud infrastructure (**AWS**), with a focus on **EC2** and **ECS**, where I frequently deploy containerized applications using **Docker**. This combination allows me to handle high-demand environments—from heavy data processing to high user traffic—ensuring stability and performance.

I have hands-on experience with **microservices architectures**, including container orchestration and service integrations. With my advanced **Linux** knowledge, I can operate in any environment, though I prefer **EC2** for the full control it offers—from deployment and monitoring to configuring tools like **Grafana** for real-time logging and metrics.

{% include about/skills.html title="Main Skills" source=site.data.main-skills %}
{% include about/skills.html title="Programming Skills" source=site.data.programming-skills %}
{% include about/skills.html title="DevOps Skills" source=site.data.devops-skills %}
{% include about/skills.html title="Other Skills" source=site.data.other-skills %}

{% include about/timeline.html %}

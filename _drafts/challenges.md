---
layout: blog-post
title:  "Challenges"
date:   2025-05-07 16:09:08 -0500
categories: system
description: Time based 
permalink: /system/2025/05/07/reading-bingo.html
previewImage: /assets/images/2025-05-07-challenges/waterfall-small.png
---

## Inspiration

For the past few years, my wife and I have started the year with a little challenge. We were inspired by [75 hard](https://andyfrisella.com/pages/75hard-info), which is ridiculous but not without merit. The gist is that 75 days straight, execute a few habits daily: excercise twice, eat within the guidelines of a dietary plan, avoid alcohol, drink 140 fl oz of water, and read some amount of a non-fiction book. Missing a day causes the timer to reset. 

The good things about it are that it fosters consistency, focuses on nutrition, and staying active. The bad things are that the bar is set unneccessarily high in nearly every category, and reseting the clock when a single day is not effective demotivating for the vast majority of people. We approached it a bit more generically, creating a list of habits for ourselves to do every day and having a clear date. I decided to create a simple scoring system to gauge how well performed the challenge, a fully done day is 2 points, doing some of the activities is 1, and nothing is 0. The scoring for 70 days done fully,  4 done halfway, and 1 missed completey would be (2(70) + 4) = 144 total points. Divided by the total number of possible points, 2 * 75 = 150, the completion rate is 96%.

This year my list of activites was:
* weigh in
* excercise
* eat within a calorie budget
* drink 80 oz of water
* read 10 pages of a book (fiction is just as valuable, if not more, than non-fiction)
* don't get drunk
* don't smoke weed

This got me thinking about how a general challenge framework would look in the context of my [routine system.](/system/2024/03/27/keeping-time.html) I've noticed that focusing on daily routines typically increases how well I lock into tasks overall. One of my most productive times of the year is generally when we try our 75 day challenge. Since the challenge offers a bit of novelity and a nearby target, it draws my attention to it. Having an accountability partner also helps. 

<!-- <div style="position: relative;overflow: hidden;width: 100%;max-width:600px;margin:0 auto;padding-top: 56%;"><iframe src="https://clip.cafe/e/702453" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width: 100%;height: 60%;"></iframe></div> -->

## Software

I enjoy building small tools to reduce the friction of using productivity tools. For this, I used Reminders, Shortcuts, and Data Jar.

To start a challenge, I use an easily accesbile menu via shortcuts. The challenge needs a name, an end date, and then will provide a list of all items that are on my daily routine list, and the user can select N number of reminders to be marked for the current session.

Each day an automation runs the builds a list of daily routines based on the list stored in data jar. I add a tag for challenge, and then have a challenge smart list in my reminders app to know which routines I need to ensure I complete. At the end of the day, the score is calculated based on the pattern above (2 points for all complete, 1 for some, 0 for none) and then saved to Data Jar. This score accumulates for the duration of the challenge.

At the end of the challenge, a summary for the challenge, including the name, score, and duration of days, is written to Notes in a folder for logs.

## Impact

This year my challenge went well.

<!-- 
    @TODO
    * Add photos for evidence of crimes
    * Add summary of this year's challenge
    * Section on generalized challenges
    * Photos for thumbnail
    * Add description
 -->

# Ideas

- T-Rex run
- Doodle Jump
- Alex Kidd
- Lemmings

https://foxyofjungle.itch.io/lemmings-but-1-object  
https://github.com/FoxyOfJungle/Lemmings_But_1_Obj  

https://gifer.com/en/3QWz  
https://scottishgames.net/2021/02/15/happy-birthday-lemmings-30-today/  
http://www.boxedpixels.co.uk/2014/11/game-065-lemmings-2-tribes.html  
https://tenor.com/view/space-bob-lemmings-1jps-gif-25383471  
https://tenor.com/view/games-vintage-pixels-gif-9131396  
https://kkatlas.wordpress.com/2015/08/31/game-review-lemmings/  
https://i0.wp.com/cdn.duelinganalogs.com/wp-content/uploads/2013/05/lemmings-animated.gif?zoom=2  
https://i0.wp.com/l.j-factor.com/gifs/Lemmings-OnlyFloatersCanSurviveThis.gif?zoom=2  
https://www.deviantart.com/lechuckie/art/lemming-stop-18883716  

https://github.com/ironhack-loopey-tunes-may2023/oop-game-codealong  

[playthrought (DOS)](https://www.youtube.com/watch?v=xIuxB1oR2WQ )

[jslems web clone](http://funhtml5games.com/jslems/lemms.php)

<!-- ![lemming-gif-alt-text](https://i.gifer.com/80rm.gif) -->
<!-- <img src="https://i.gifer.com/80rm.gif"> -->

<!-- animated gif not visible in GitHub because Giffer is actually returning a .mp4 file! -->

![lemming-gif-alt-text][lemming-gif]

[lemming-gif]: https://i.gifer.com/origin/43/4381cee4efb9b74ab41c7c2a2d38ce81.gif

&nbsp;

---

# To do (priority descending)

- clean code for last commit / clean README.md
- use gif v6 for walk left instead of buggy css transform
- add floor obstacles
- add lava floor
- add umbrella skill
- change `%` to `vw`
- finish to implement player and re-enable it?
- find better solution to workaround for restart gif anim
- fix `FIX` when needed
- fix typo in old commit message
- fix spawn so it auto corrects its timeout delay based on how low before the alert is discarded (save time before and after)
- in Chrome Dev Tools > Elements > div.walk > img > flex: 1 0 auto; appears (even if not enabled) while commented out in css! weird... (browser cache issue?)

<br>

- deploy online using GitHub Pages
- Stick with KISS (Keep It Simple Stupid) and DRY (Don’t Repeat Yourself) principles...

<br>

```js
var g = 1
```

> - test subpixel rounding vs getBoundingClientRect() subpixel values
> - subpixel values from getBoundingClientRect() looks like a conversion using points...

&nbsp; <!-- empty HTML comment does not work --> <!-- <br> --> <!-- <br /> --> <!-- &nbsp; bigger space than br --> 

- make presentation

<br>

## Questions
1. new spec but impossible to do without refactoring all code, is it normal?
2. navigate code by symbols in Chrome Debug Tools > Sources like in GitHub?
3. Chrome debugging possible to change variables value live?

&nbsp;

---

## Directory Tree

`git ls-tree --name-only -r  master`

* [README.md](README.md)
* [index.html](index.html)
* [gameover.html](gameover.html)
* [js](js)
    - [main.js](js/main.js)
* [css](css)
    - [nodebug.css](css/nodebug.css)
    - [styles.css](css/styles.css)
* [images](images)
    - [ideas](images/ideas)
    - [lemming gifs v1](images/lemming%20gifs%20v1)
    - [lemming gifs v2](images/lemming%20gifs%20v2)
        - ?

&nbsp;

---

# Presentation

## Format
- Talking with Slides: 3 minutes
- Demo: 2 minutes
- Total: 5 minutes

All presentations will be done from a staff member’s computer, so your slides need to be online.  
https://www.google.com/slides/about/  
https://docs.google.com/presentation/u/0/  

## Presentation Structure
1.	Title Slide (1 slide): your project’s name & your name
2.	About Me (1-2 slides):
    - Where are you from?
    - What are some interesting facts about you? (hobbies, travels, etc.)
3.	Project Elevator Pitch (1-2 slides):
    - What is your project?
    - How does it work?
    - Why did you choose it?
4.	Technical Challenge (1-2 slides):
    - What was the most important technical challenge you faced?
    - How did you overcome that challenge?
5.	Big Mistake (1-2 slides):
    - What was the biggest mistake you made during this project?
    - What did you learn from it?
6.	Demo Slide (1 slide): literally says “DEMO” with a link to your project so you can open it easily
7.	Closing Slide (1 slide): your project’s name, your name & a “Thank You”
8.	Total: 7-11 slides

### Presentation Structure Notes
- Don’t include a slide just for the technologies.
- Don’t include any code in your slides. Nobody will read it.
- Don’t include a slide for GitHub graphs.
- If you think that deviating from the structure improves your presentation, feel free to do so. This suggested structure is mostly for people who don’t know what to do.

&nbsp;

---
Notes

Lemmings gifs colors
- Green #00FF00
- Blue #0000FF

CTRL+SHIFT+O in Chrome Dev Tools > Sources to go to a symbol 🤯
conditionnal breakpoint: right click on line number in Sources
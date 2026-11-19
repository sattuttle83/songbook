# Music Theory for Guitar: course plan & coach's notebook

This file is the coach's brain. The scheduled agent reads it before writing each lesson and updates the **Progress log** at the bottom after every run. The student can edit it too (to ask for more of something, skip something, or change the pace).

Live course: https://sattuttle83.github.io/songbook/theory/

## The student
- Adult beginner learning guitar. Plays open chords from a country songbook; uses the Songbook app (`../index.html`) on an iPad.
- Plain-spoken, practical. Calls himself "an ole country boy." Likes country and gospel.
- Has kids. Practice ideas that pull them in are welcome but not required.
- Lessons are done on an iPad, about 15 minutes a day, weekdays.

## How to teach
- **One idea per lesson.** Short sections, plain words, no jargon without a one-line explanation the first time it shows up.
- **Hands on the neck every lesson.** Every lesson has at least one fretboard or chord widget, at least one "Try it" on the real guitar, and a "Today's 5-minute practice" box.
- **Tie it to real playing.** Connect theory to open chords, country/gospel progressions, the capo, and transposing (the Songbook app has a transpose button). Chord progressions are fine to reference. **Never reproduce song lyrics.** Refer to songs by title only, if at all.
- **Friday lessons are review and "put it to work"**: a mixed review of the week's topics, a progression to play using what was learned, and a slightly longer quiz (8–10 questions).
- **Quiz:** 6–8 questions (8–10 on Fridays), each with a short `topic` slug that names the skill (reuse slugs across lessons so weak spots can be tracked). Include at least one listening question (`notes`, `strum` or `progression`) from Lesson 3 onward. Each `explain` is one or two plain sentences.
- Accuracy matters: double-check every note name, fret number, interval and chord shape before publishing. Standard tuning E A D G B E.

## Adapting to results
Quiz results arrive as GitHub issues titled `Results: Lesson N — X/Y` (the student taps "Send my score to the coach"). Body lists missed and right topics, plus an optional note.
- Score **under 70%** on a lesson: the next lesson opens with a "Back to …" re-teach section (a different explanation and a new widget, not a copy) and moves ahead only a little.
- **Missed a topic twice** across lessons: give it its own short lesson.
- **100% two lessons in a row**: you may combine or skip a planned lesson that's below his level.
- The student's **note** in a result wins. If he says something's too easy, too hard, or asks for something, do that.
- **No results came in**: just follow the plan. Don't nag. One gentle line in the lesson is fine ("If you take the quiz, tap Send so I can tune tomorrow's lesson").
- After reading a result issue, comment a one-line reply (what the next lesson will do with it) and close it.

## Syllabus (a plan, not a contract: adapt it)
**Unit 1 · Notes on the neck**
1. The musical alphabet & the low E string ✅
2. The A string, and the octave shortcut (same note two strings up, two frets up)
3. Sharps vs. flats: when a note gets which name; finding sharps on E and A
4. Root notes for barre and power-chord shapes on E and A (the "movable chord" idea)
5. Friday review: name-that-note drills, E and A strings

**Unit 2 · The major scale**
6. Whole and half steps: the W-W-H-W-W-W-H formula
7. Building the G major scale (one F♯), playing it on one string
8. The major scale in one position (G, open position)
9. C, D, A and E major: which sharps each key has
10. Friday review: hear and build major scales

**Unit 3 · Keys & the number system**
11. Scale degrees: numbering the notes 1–7
12. The 1-4-5 in G, C, D, A and E: the three chords that run most country songs
13. Nashville number system: reading a number chart
14. Transposing with numbers, and how the capo really works (capo + shapes = new key)
15. Friday review: play a 1-4-5 in four keys

**Unit 4 · How chords are built**
16. Triads: root, 3rd, 5th. Why C is C-E-G
17. Major vs. minor: one note makes the difference (hear it)
18. The chords in a key: 1, 2m, 3m, 4, 5, 6m (and why the 6m is the sad chord)
19. 7th chords: the dominant 7 (G7, D7, A7) and why it pulls home
20. Friday review: build and name chords

**Unit 5 · Country & gospel progressions**
21. 1-4-5 and the "turnaround"
22. 1-6m-4-5 and 1-5-6m-4
23. The 2-5-1 and the secondary dominant (the "II7" in old country and gospel)
24. Picking out a song's key and chords from a chord sheet
25. Friday: transpose a progression for a different voice, with and without the capo

**Unit 6 · Rhythm & feel**
26. Counting 4/4; quarter and eighth notes
27. Boom-chick: alternating bass strum
28. 3/4 waltz time
29. The shuffle / swing feel
30. Friday review: name the time signature by ear

**Unit 7 · Walking it**
31. Bass runs: G to C walk-up
32. G to D and C to G walk-downs
33. Passing chords: G-G/B-C
34. Hammer-ons and pull-offs inside chords
35. Friday: put walk-ups into a 1-4-5

**Unit 8 · Licks & the pentatonic**
36. Major pentatonic in G (the country sound)
37. Minor pentatonic and the blues note
38. Sliding between positions
39. Fills between vocal lines
40. Friday: build your own 4-bar fill

**Unit 9 · Ear training**
41. Hearing the 1 (home)
42. Hearing the 4 vs. the 5
43. Hearing the 6m
44. Picking out a simple song by ear
45. Course finale and "what's next"

## Lesson page reference (for the agent)
Copy the structure of `lessons/001-musical-alphabet.html`: same `<head>` (fonts, `../assets/course.css`, `../assets/course.js`), `<body data-lesson="N">`, a `.topbar`, `.kicker` with the unit, `h1`, `.lede`, sections, a `.card` practice box, `#quiz-root` + `<script type="application/json" id="quiz">`, then `<div class="next-prev"></div>` and a `.foot` teaser for the next lesson. File name: `lessons/NNN-short-slug.html` (three-digit number).

Widgets provided by `assets/course.js`:
- Fretboard: `<div class="fretboard" data-frets="12" data-labels="none|naturals|all|C,E,G" data-marks="string:fret:label,..." data-flats></div>`. Strings are numbered 1 (high e) to 6 (low E). Tapping plays the note and shows its name. Labels show note names on every string; marks highlight specific spots in the accent color.
- Fretboard game: add `data-game="find" data-pool="naturals|all|C,D,E" data-strings="6,5" data-rounds="10"`.
- Chord charts: `<div class="chords" data-chords="G:320003, C:x32010, F:1-3-3-2-1-1"></div>`. Shapes list strings 6→1. Use dashes when any fret is 10 or higher. Tap to strum.
- Play buttons: `<button class="play" data-notes="C4 E4 G4" data-gap="0.4">`, `data-strum="x32010"`, or `data-progression="320003 x32010 xx0232 320003" data-gap="1.1"`. Note names use scientific pitch (low E string open = E2, middle C = C4); sharps written `#`, flats `b`.
- Callouts: `<div class="callout">` (key idea), `<div class="callout review">` (re-teach of a weak spot), `<div class="try">` (play it on your guitar), `<div class="notes-row">` (row of note chips; `nat` and `gap` classes).
- Quiz JSON: `{"lesson":N,"title":"…","questions":[{"q":"…","choices":[…],"answer":<index>,"topic":"slug","explain":"…", optional "notes"/"strum"/"progression"/"gap"}]}`.
- `lessons.json` entry: `{"n","date","title","unit","minutes","summary","file","topics"}`, appended in order.

## Progress log
(Newest at the bottom. One short entry per run: date, lesson published, results read, what changed and why.)
- 2026-11-19: Course set up. Lesson 1 (musical alphabet & low E string) published. No results yet.

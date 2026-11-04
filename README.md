# 🎸 Chord Songbook

A simple songbook app for the iPad (and phone) that shows chords right above the lyrics, where they belong.

I built this because I'm learning to play and got tired of digging through stacks of printouts and PDFs. Now every song I'm working on lives in one place. I can change the key with a tap, and the screen scrolls for me while I play.

**Open it here:** https://sattuttle83.github.io/songbook/

---

## What it does

- **Chords above the lyrics.** Each chord sits over the word where it changes.
- **Change the key.** Tap − or + to move every chord up or down, if a song's too high or too low for your voice.
- **Chord charts.** Tap any chord to see where your fingers go.
- **Hands-free scrolling.** Set how long the song is (like 3:30) and the page scrolls along with you.
- **Page-turner pedal.** A Bluetooth foot pedal turns the page. At the end of a song it goes to the next song in your setlist.
- **Setlists.** Put songs in the order you'll play them for a gig, a jam, or church, with big Next and Prev buttons.
- **Folders.** Sort songs into groups like Country, Gospel, or Slow. A song can be in more than one.
- **Stage mode.** Big, bright text on black so you can read it under lights, with the editing buttons locked away so a bumped screen doesn't mess anything up.
- **Works without internet.** Once it's on your iPad, it runs anywhere: the back porch, the truck, the stage.

---

## Getting it on your iPad or phone

**iPad or iPhone**
1. Open **Safari** and go to https://sattuttle83.github.io/songbook/
2. Tap the **Share** button (the square with the arrow pointing up).
3. Tap **Add to Home Screen**, then **Add**.
4. Open **Songbook** from your home screen, close it, and open it once more while you have internet. After that it works offline.

**Android phone**
1. Open the link in **Chrome**.
2. Tap the **⋮** menu, then **Add to Home screen** or **Install app**.

> Always open it from the home-screen icon, not from Safari. The home-screen app keeps its own songs.

---

## Adding songs

Tap **+ New song** and type or paste. There are two ways to write chords, and you can use either one.

**Chords in brackets**: put the chord right before the word it lands on:
```
{title: Amazing Grace}
{artist: John Newton}
{key: G}

Verse 1:
A[G]mazing [G7]grace, how [C]sweet the [G]sound
```

**Chords on the line above**: the way most chord websites and songbooks show it. Paste it in and the chords line up on their own:
```
Verse 1:
G         G7          C        G
Amazing grace, how sweet the sound
```

**Handy extras**
- `{title: …}` sets the song's name in your list. Also available: `{artist: …}`, `{key: G}`, `{capo: 2}`, `{tempo: 80}`.
- A short line ending in a colon, like `Verse 1:` or `Chorus:`, makes a section heading.
- `{c: Repeat x2}` puts a little note between sections.

**Bringing in a whole songbook:** tap **Import** and pick a song file (`.json`, `.txt`, `.cho`). The app asks which folder to put the songs in.

---

## Playing out

1. **Make a setlist:** tap **Setlists**, then **+ New setlist**, give it a name, and tap **+ Add songs**. Use ▲▼ to put them in order.
2. **Set each song's length** next to Auto-scroll, so the page keeps pace with you.
3. **Tap ▶ Play set**, then **Stage**.
4. Use the foot pedal or the big **Next ▶** button between songs.
5. To leave stage mode, tap **Exit stage** twice. It's two taps on purpose, so you can't bump it by accident.

**Pedal and keyboard keys**

| Key | What it does |
|---|---|
| Page Down / ↓ / → | Next page (next song at the end of a song in a setlist) |
| Page Up / ↑ / ← | Previous page (previous song at the top of a song) |
| Space | Start or stop auto-scroll |
| + / − | Change the key |

---

## Keep a backup

Your songs, setlists, and folders are saved **on that device only**. Nothing is stored here on GitHub.

- Every so often, tap **Back up all songs**. It saves a file to your Files app. Keep it in iCloud Drive or on your computer.
- **New iPad or phone?** Install the app, tap **Import**, and pick that backup file. Everything comes back, setlists and folders included.
- If you delete the app from your home screen, its songs go with it, so back up first.

---

## Updating the app

When there's a new version:
1. Upload the new `index.html` and `sw.js` to this repository (**Add file → Upload files → Commit changes**).
2. Open Songbook on the iPad with internet, close it, and open it again.

Your songs stay put through every update. See [CHANGELOG.md](CHANGELOG.md) for what changed in each version.

---

## What's in this repository

| File | What it is |
|---|---|
| `index.html` | The whole app |
| `sw.js` | Makes it work offline |
| `manifest.webmanifest`, `icon-*.png` | The app's name and home-screen icon |
| `README.md` | This page |
| `CHANGELOG.md` | Version history |

**Song files don't go here.** This repository is public, so lyrics from songbooks stay on my own devices and backups.

---

## Still to come

- My songs showing up on every device automatically
- Turning PDF songbooks into songs right inside the app
- Keeping sheet music pages alongside the chord charts

---

*Built one song at a time. Keep pickin'.* 🤠

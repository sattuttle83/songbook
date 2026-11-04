# Chord Songbook: version history

Naming convention
- App:  ChordSongbook_vNN_YYYY-MM-DD_short-description
- Songs: SongData_<Book>_vNN_YYYY-MM-DD_short-description.json
- vNN is a two-digit number that goes up by one for every release, so folders sort in order.

| Version | Date | What changed |
|---|---|---|
| v01 web-version | 2026-11-03 | First single-page version: chords over lyrics, transpose, chord charts, auto-scroll |
| v02 ipad-app | 2026-11-03 | Installs on the iPad home screen, works offline, pedal support, screen stays on, backups |
| v03 word-wrap-fix | 2026-11-04 | Words with a chord inside no longer split across lines |
| v04 import-updates-songs | 2026-11-04 | Re-importing a song replaces it instead of adding a copy |
| v05 delete-all | 2026-11-04 | Delete all button; imports clean up extra copies |
| v06 setlists-length-stage | 2026-11-04 | Setlists with Prev/Next and pedal song changes, timed scroll by song length, stage mode |
| v07 folders | 2026-11-04 | Folders, filing on import, folder filter in setlists, phone layout fixes |

| Song file | What changed |
|---|---|
| Vol1 v01 first-import | 40 songs split from 4 Chord Country Songbook |
| Vol1 v02 chord-alignment | 322 chords moved to the start of their word or syllable |
| Vol2 v01 first-import | 40 songs split from 4 Chord Songbook Volume II |
| Vol2 v02 chord-alignment | 254 chords moved to the start of their word or syllable |
| Vol2 v03 section-heading-fixes | Fixed headings mistyped in the PDF (Yours, Sweet Home Alabama, You Should Probably Leave) |

To install any app version: upload the files inside its site/ folder to the songbook repository on GitHub.
Current version: v07. Current song files: Vol1 v02 and Vol2 v03.

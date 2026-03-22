# Reaction Lab

**Test your reflex speed.**

A minimal reaction time tester with a neo-brutalist UI. Click when the screen flashes, measure your reflexes in milliseconds, and compete against a mock leaderboard.

## How to Run

1. Clone the repository
2. Open `index.html` in any modern browser

No build tools, no dependencies — just open and play.

```bash
git clone <repo-url>
cd Reaction-Lab
open index.html
```

Or use a local server:

```bash
npx serve .
```

## Features

- Random trigger timing (1.5–5s delay)
- Reaction measurement in milliseconds
- False start detection
- Best score tracking (localStorage)
- Mock leaderboard with user ranking
- Responsive layout (desktop + mobile)

## Suggested Enhancements

1. **Multiplayer mode** — Add real-time WebSocket-based head-to-head reaction battles
2. **Reaction history chart** — Track and visualize past attempts with a sparkline or bar chart
3. **Sound & haptic cues** — Add an audio beep on trigger and vibration feedback on mobile for accessibility

## Metadata

| Field | Value |
|---|---|
| **Title** | Reaction Lab |
| **Tagline** | Test your reflex speed |
| **Category** | Game / Interactive Tool |
| **Ideal Thumbnail** | The bright red "Click now!" ready state with the bold title above |

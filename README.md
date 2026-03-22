# Reaction Lab

**Test your drag strip reflexes.**

A minimal drag racing reaction tester with a neo-brutalist UI. Stage up, watch the drag tree count down through the ambers, launch on green, and measure your reaction time in milliseconds.

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

- Drag racing light tree with prestage, stage, amber, green, and red bulbs
- Randomized staging delay before the tree drops
- 0.4s amber cadence leading into green
- Red light detection for jumping before green
- Reaction measurement in milliseconds from green to launch
- Best score tracking (localStorage)
- Personal top-five leaderboard
- Responsive layout (desktop + mobile)

## Suggested Enhancements

1. **Bracket mode** — Add configurable pro tree vs sportsman tree timing and dial-in handicaps
2. **Reaction history chart** — Track and visualize past attempts with a sparkline or bar chart
3. **Sound & haptic cues** — Add launch sounds, red-light buzzer, and vibration feedback on mobile for accessibility

## Metadata

| Field | Value |
|---|---|
| **Title** | Reaction Lab |
| **Tagline** | Test your drag strip reflexes |
| **Category** | Game / Interactive Tool |
| **Ideal Thumbnail** | The drag tree lit up green with the launch time showing below |

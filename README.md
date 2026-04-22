# THE WAY — Cambodia Toilet Monopoly

<div align="center">

<!-- Replace with actual GIF: record 5s of gameplay with ScreenToGif or LICEcap, save as docs/demo.gif -->
<!-- ![Gameplay Demo](docs/demo.gif) -->

**A browser-based game that puts you in Cambodia's sanitation crisis.**  
Built for a real NGO client as part of an integrated fundraising campaign.

[![Live Demo](https://img.shields.io/badge/▶_Play_Live-cambodia--toilet--monopoly.vercel.app-5EAB78?style=for-the-badge)](https://cambodia-toilet-monopoly.vercel.app)
[![Impact Dashboard](https://img.shields.io/badge/📊_Impact_Dashboard-GitHub_Pages-70C8E8?style=for-the-badge)](https://beltran12138.github.io/the-way-impact-dashboard/)
[![License](https://img.shields.io/badge/license-MIT-FFD166?style=for-the-badge)](LICENSE)

</div>

---

## The Problem

**74% of rural Cambodians lack access to safe sanitation.**  
Without toilets, a young woman walks 20 minutes in the dark every night — facing harassment, disease, and loss of dignity.  
Most people scroll past donation appeals because the cause feels abstract and distant.

**This game makes it real.**

---

## What It Is

A 4-player collaborative board game where **3 Donors race to build toilets** before a Villager loses all HP crossing the board 5 times. Every village without a toilet deals damage. Every random event is drawn from real Cambodia WASH data.

Winning = understanding why sanitation matters.  
Losing = understanding what it costs when it doesn't.

Built as **EXE 03** of THE WAY campaign, deployed live as an educational engagement tool for donor events.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 + custom CSS variables |
| Game Board | CSS Grid 7×7, aspect-ratio 1:1 |
| Charts | Custom Canvas 2D API (no library) |
| Persistence | localStorage (game save/load) |
| Deploy | Vercel (auto-deploy from GitHub) |
| CI | GitHub Actions |

---

## Campaign Context

This game is one of **6 integrated executions** in THE WAY — a World Toilet Day fundraising campaign produced for [ADOL (A Drop of Life)](https://adropoflife.org) as part of CUHK COMM3400B.

```
THE WAY Campaign Architecture
│
├── EXE 01 · 60s AI Film          FEEL   — pixel→real emotional trigger
├── EXE 02 · #IAmToiletOwner      SHARE  — social media viral challenge
├── EXE 03 · Monopoly Game ◄ YOU  TRACK  — gamified education (this repo)
├── EXE 04 · CaaS Subscription    GIVE   — HK$50/300/3,500/mo donor tiers
├── EXE 05 · GEO Strategy         REACH  — JSON-LD for LLM/AI search indexing
│
└── TaaP (Toilet as a Product)
    ├── Ownership Certificate (serial: TW-2026-XXXX)
    ├── Google Maps named location
    └── Custom wall mural with donor message
```

### What is GEO?
Generative Engine Optimisation — structured content (JSON-LD schema: NGO + Event + FAQPage) designed to be cited by ChatGPT, Gemini, and Perplexity when users search for Cambodia sanitation charities. Most nonprofits haven't started this yet.

---

## Features

- **7×7 board** — 24 edge tiles, Animal Crossing aesthetic
- **4 player roles** — 1 Villager (survival) + 3 Donors (build toilets)
- **Difficulty system** — Easy / Normal / Hard (affects HP, costs, scoring)
- **Random event system** — real Cambodia WASH statistics as in-game events
- **Dignity Cards** — menstruation / harassment / safety scenarios
- **Achievement system** — unlockable milestones
- **Impact Dashboard** — live DALY savings counter, toilet build tracker
- **Game save/load** — localStorage persistence
- **Mobile responsive** — playable on phones

---

## Getting Started

```bash
git clone https://github.com/Beltran12138/cambodia-toilet-monopoly.git
cd cambodia-toilet-monopoly
npm install
npm run dev
# → http://localhost:5173
```

---

## Project Structure

```
src/
├── App.tsx              # Main game logic + layout
├── components/
│   ├── Board.tsx        # 7×7 CSS Grid board
│   ├── PlayerStats.tsx  # HP gauges + fund display
│   ├── ImpactDashboard.tsx
│   ├── CambodiaStats.tsx
│   ├── DifficultySelect.tsx
│   └── AchievementSystem.tsx
├── hooks/
│   └── useGameLogic.ts  # Core game state machine
└── index.css            # Tailwind + custom Animal Crossing palette
```

---

## Related

- **[Impact Dashboard](https://github.com/Beltran12138/the-way-impact-dashboard)** — donor microsite with K-line charts, CaaS tiers, TaaP certificates
- **[Campaign Overview](https://github.com/Beltran12138/the-way-campaign)** — full strategy, GEO setup, growth flywheel

---

## Credits

Produced in partnership with **ADOL (A Drop of Life)** — a Hong Kong-based NGO building sanitation infrastructure in rural Cambodia.  
Academic context: CUHK COMM3400B Integrated Marketing Communications, 2025–2026.

---

<div align="center">
<sub>If this project gave you any ideas, a ⭐ helps others find it.</sub>
</div>

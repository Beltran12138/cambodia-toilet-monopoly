# THE WAY: Cambodia Toilet Monopoly Challenge

## 1. Project Overview
This project is a digital version of the "Monopoly" challenge from the THE WAY campaign. It's a collaborative game where 3 Donors and 1 Villager work together to ensure the villager's survival through 5 laps of the board by building toilets in various villages.

## 2. Aesthetic Direction: Industrial/Utilitarian
The UI follows a strict **Industrial/Utilitarian** aesthetic:
- **Colors**: Clay Red (#A0522D), Construction Orange (#FF8C00), Concrete Slate (#2F4F4F).
- **Typography**: Staatliches (Headings), Space Mono (Body).
- **Design Elements**: Brutalist panels, grid-breaking layouts, metallic textures, and professional icon libraries (FontAwesome).

## 3. Core Mechanics
- **Villager Survival**: Villager starts with 100 HP. Stops at villages without toilets cause HP loss. 5 laps are required to win.
- **Donor Construction**: Donors move around the board and spend funds to build Small ($200) or Large ($500) toilets.
- **Collaborative Winning**: All players win if the Villager completes 5 laps with HP > 0.
- **Social Impact**: Educational random events highlighting the dangers of poor sanitation in Cambodia.

## 4. CloudBase Resources
- **Static Hosting**: Deployed for public access.
- **Environment**: `theway-2gfdpspmc0387027`
- **Frontend**: React + TypeScript + Tailwind CSS.

## 5. Getting Started
1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev` to start the local development server.
4. Visit `http://localhost:5173`.

---
*Developed as part of the THE WAY social awareness campaign.*

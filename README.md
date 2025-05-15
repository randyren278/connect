# 🔗  **Connections**  

A hyper-challenging, NYT-style “Connections” clone built with **Next .js / React
Server Components**, Tailwind CSS, and Framer-Motion.  
It ships **100 % offline**: no external APIs, all curated data, and loads of
sneaky cross-talk mechanics (homophones, prefix/suffix traps, multi-word
phrases, ambiguous tokens…) to melt even puzzle veterans.

---

## 🎮  Gameplay

| Step | What happens |
|------|--------------|
| **1.** Hit **Play** ➜ a 4 × 4 grid of words appears. |  
| **2.** Select **4** words you think form a valid group ⮕ **Submit**. |  
| **3.** Correct 🟢 → those cards wave, lock, and reveal the theme. <br>Wrong 🔴 → you lose a “life” (4 total) and might see a hint (“⚠️ One away”). |  
| **4.** Solve all four groups before your mistakes or sanity run out. |  
| **5.** Fail?  Reveal answers or **Play Again** (themes won’t repeat for 10 games). |

> **Heads-up:** With ~95 % probability each group secretly swaps in **one**
> of:  
> • a homophone _(KNIGHT vs NIGHT)_  
> • a word that shares a killer prefix/suffix _(MOTION vs -ION group)_  
> • a multi-word phrase _(“ORANGE JUICE”)_.  
> Expect maximum ambiguity.

---

## ✨  Key Features

| Feature | Description |
|---------|-------------|
| **🗂️  All-local curated data** | 200 themes × 4 difficulties = 800 sets + 1,000 + ambiguous decoys. |
| **🧩  No-repeat logic** | Never see the same theme or exact 4-word set for 10 full rounds. |
| **💥  Wave animation** | Cards “pop” in a cascading wave when a set is solved (Framer-motion). |
| **📱  Fully responsive** | Font `clamp()` + `break-words` keeps long phrases inside cards on tiny screens. |
| **♿  Keyboard & screen-reader friendly** | Buttons focusable, semantic markup. |
| **⚡  Zero external calls** | Works offline after first load; ideal for workshops or airplane coding. |

---

## 🛠️  Tech Stack

| Layer | Lib / Tech |
|-------|------------|
| Front-end | **Next 13** (App router, RSC), **TypeScript**, **React 18** |
| Styling  | **Tailwind CSS** + arbitrary values (`text-[clamp(...)]`) |
| Animation| **Framer-motion** 6 |
| State    | React hooks + tiny in-memory caches |
| Data     | Pure JSON / TS files (no database, no REST) |

---

## 🚀  Quick Start

```bash
git clone https://github.com/your-handle/connections-brutal.git
cd connections-brutal
pnpm install          # or yarn / npm
pnpm dev              # http://localhost:3000

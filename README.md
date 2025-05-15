# 🔗  **Connections**  

A hyper-challenging, NYT-style “Connections” clone built with **Next .js / React
Server Components**, Tailwind CSS, and Framer-Motion.  
It ships **100 % offline**: no external APIs, all curated data, and loads of
sneaky cross-talk mechanics (homophones, prefix/suffix traps, multi-word
phrases, ambiguous tokens…) to melt even puzzle veterans.

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

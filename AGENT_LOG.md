# Agent Log

Short notes on where I used AI while building this.

## Setup

I put together a basic Next.js + TypeScript app myself, then used AI a couple of times for scaffolding:
- Asked for a minimal example of wiring Tailwind with Next 16
- Looked up a small snippet for a simple tabbed layout

Most of the folder structure and routing I wired by hand.

## Data & Storage

I drafted the `Company`, `Job`, and `ContentSection` types on my own, then used AI once to sanity‑check them and suggest any obvious missing fields.  
It mainly confirmed things like having a `job_slug`, basic branding fields, and timestamps.

For localStorage, I already knew the general pattern. I just double‑checked a safe `typeof window !== "undefined"` guard and then wrote the rest of the helpers myself.

## UI / UX Bits

The main editor flow (tabs for Company / Branding / Content / Jobs) and the public careers page layout were sketched by me.  
I did use AI for:
- A starting point for the job edit dialog
- A lightweight idea for how to structure the filters (search + a few dropdowns)

From there I simplified the code and adjusted the layout/copy to fit what I wanted.

## Small Fixes

- Checking a slug helper so it handled spaces and some special characters
- Suggesting a simple way to avoid duplicate job slugs
- Showing a basic JSON‑LD example for job postings that I trimmed down

Most of the debugging (localStorage quirks, layout tweaks, and edge cases) I handled directly in the browser.

## Takeaways

- AI was useful for quick references and second opinions, not as the main driver
- It works best when I already know roughly what I want and just need a small example
- I preferred to keep the logic simple and write most of the code myself so it stayed easy to reason about



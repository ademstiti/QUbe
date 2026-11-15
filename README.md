# QUbe — Your space between classes.

An interactive concept website for the proposed QUbe student hub. Built from `PRD.md` and `AGENTS.md` with React, TypeScript and Vite, original SVG illustrations, and browser-local reservations.

## Run locally

```sh
cd website
npm install
npm run dev
```

Open the local URL printed by Vite. To check the prototype:

```sh
npm test
npm run build
```

## Present the demo

Explore any of the four space types, pick a future date/time, reserve, and confirm the editable example student details. Your sample QR pass contains only the unique demo reference. Open **My Bookings**, refresh, reopen the pass, or cancel to release the assigned unit. To demonstrate full inventory quickly, reserve both Group Study Rooms for the same slot.

All booking times use Qatar time. Sample hours are 08:00–22:00. Rest/Focus/Group visits last 1 or 2 hours; showers last 30 minutes. Bookings persist in localStorage on the same browser and origin; different devices or deployment URLs do not share reservations.

## Vercel

Live prototype: **https://qube-student-hub.vercel.app**

Import the repository in Vercel and set **Root Directory** to `website`. The Vite build and `website/vercel.json` provide the deployment configuration. Alternatively, run `vercel --prod` from `website` with an authenticated Vercel CLI.

Validation covers 14 booking-rule tests plus an automated DOM journey through filtering, duration and capacity controls, reservation, saved-booking reload, pass reopening, cancellation, and all four space types. The production build passes. Visual browser inspection was unavailable because Computer Use access was not approved.

## Demo boundaries

QUbe is a proposed concept, not an operating facility or university-affiliated service. Images are illustrative. Prices, inventory and opening hours are sample values. No payment, verification, email, live IoT or door access is provided. The presentation PDF was not present in the supplied workspace; the design follows the palette and direction described in the brief.

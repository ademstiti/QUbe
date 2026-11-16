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

3D campus concept: **https://qube-student-hub.vercel.app/#/campus**. Explore 13 proposed container hubs serving the metro and all 12 QU colleges. Select a numbered hub or use search and category filters; switch between 3D and 2D, rotate, zoom, inspect the container models, or open the nearby reference landmark in Google Maps. The default map uses a bundled OpenStreetMap snapshot; the optional street overlay needs internet access. Browsers without WebGL get an accessible 2D campus fallback. Landmarks, approximate college areas, and proposed container footprints are labelled separately. These future stops do not add locations or inventory to the existing booking demo.

Choose **Architecture studio** or **Inspect the 3D containers** for the detailed Three.js architectural concept. It has orbit/pan/zoom, daylight and evening lighting, soft shadows, glazed and furnished modules, a courtyard and terrace, detailed planting, an open-roof cutaway, camera presets, and optional auto orbit. The campus map also has an optional guided hub tour and daylight/evening modes. Studio geometry is batched by material to keep draw calls low. Models, proportions, interiors, and proposed sustainability elements remain illustrative. Render local software geometry previews with `node --experimental-strip-types scripts/render-hub-preview.mjs` (these omit WebGL shadows and material effects).

Import the repository in Vercel and set **Root Directory** to `website`. The Vite build and `website/vercel.json` provide the deployment configuration. Alternatively, run `vercel --prod` from `website` with an authenticated Vercel CLI.

Validation covers 14 booking-rule tests plus an automated DOM journey through filtering, duration and capacity controls, reservation, saved-booking reload, pass reopening, cancellation, and all four space types. The production build passes. Visual browser inspection was unavailable because Computer Use access was not approved.

## Demo boundaries

QUbe is a proposed concept, not an operating facility or university-affiliated service. Images are illustrative. Prices, inventory and opening hours are sample values. No payment, verification, email, live IoT or door access is provided. The presentation PDF was not present in the supplied workspace; the design follows the palette and direction described in the brief.

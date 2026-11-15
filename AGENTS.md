# AGENTS.md — QUbe Website Prototype

## Your role

You are the product designer **and** frontend builder for **QUbe — Smart Student Hub**. Build a **beautiful, convincing, fully interactive demo** of a student-space booking website.

**Read `PRD.md` first.** It defines the product, demo inventory, booking behavior, visual language, and completion criteria. If requirements conflict, prefer the PRD. This is a prototype for a presentation, **not** a production application.

## The north star

A student should be able to:

1. Fall in love with the QUbe concept on the landing page.
2. Find a Rest Pod, Focus Booth, Group Study Room or Shower Suite.
3. Pick a date and time, make a demo reservation, and view a QR-style pass.
4. See the booking in **My Bookings**, refresh without losing it, and cancel it.

**The demo needs to actually work, not just look clickable.** Prioritize the booking journey and visual quality above anything else.

## Visual style — important

Use the provided presentation **`QUbe_Submission1_Canvas_MindMap_PERT.pdf`** as **brand inspiration**, if accessible in the workspace. Its visual identity features a dark-green banner, plenty of white space, clear typography, and pale mint / blue / sand modular panels.

Build a **modern hospitality-like booking website**, not a replica of PowerPoint slides.

### Core design direction

- **Primary:** forest green `#174E3B`
- **Text:** ink `#1E2A25`
- **Background:** warm white `#FBFCFA`
- **Mint:** `#E2F0E9`
- **Blue:** `#E5EFF5`
- **Sand:** `#F5EBDC`
- **Borders:** `#DCE5DF`
- **Typography:** an appealing, legible modern sans-serif such as Manrope, Plus Jakarta Sans, or Inter; use bold display headings and quiet supporting text.
- **Overall mood:** fresh, calm, premium, sustainable, and student-friendly.

Design choices that matter most:

- An **outstanding hero section** with a clear message, two purposeful CTAs and a compelling illustration/photo/visual of modular container architecture.
- Rich, editorial space cards with spacious layouts, amenity icons, price and availability.
- Tasteful micro-interactions: hover lifts, pressed states, modal transitions, success checkmark, gentle reveal-on-scroll only if it stays smooth.
- A beautiful, clear booking panel and an especially polished confirmation/pass screen.
- Seamless mobile design, usable filter chips, generous touch targets, and an uncluttered navigation menu.
- Warm, human copy; no technical or academic language on the public-facing pages.

Do **not** use neon gradients, fake stock testimonials, random analytical dashboards, generic admin templates or overdecorated glassmorphism. Do not put PERT charts on the booking website.

### Imagery

Prefer any appropriate existing assets in the project. If missing, use a few tasteful, license-appropriate architectural/study-space images or original CSS/SVG compositions; ensure every visual actually loads. An appealing illustrated modular hub is preferable to broken images or blank color rectangles. Don't block the website on sourcing perfect photos.

## Project scope

Required surfaces:

1. **Home:** hero, booking shortcut, space highlights, how it works, sustainability and proposed location.
2. **Explore Spaces:** category filters, date/time, four reservable space types, availability and prices.
3. **Space Details:** visual, amenities, capacity, available slot controls, demo cost and reserve action.
4. **Booking Confirmation:** booking reference, space/time details, stylish sample QR pass and next actions.
5. **My Bookings:** saved reservations, view pass, cancel and empty state.

These can be separate routes or carefully implemented screens/modals, whichever fits the existing project. **Navigation must be real.** Don't leave dead buttons or empty sections.

The lounge, prayer room, café/vending and outdoor seating are **amenities**, not paid reservations in this version.

## Keep the implementation lightweight

- **If the repository already has a framework, follow its conventions.** Don't rebuild a working project unnecessarily.
- **If starting from nothing:** a small React + TypeScript + Vite app with Tailwind CSS and Lucide icons is a good default. Use a routing solution only if useful.
- No backend, database service, authentication provider, payment processor, university API or IoT service.
- Use **static typed seed data** for space types and units, and **`localStorage`** for confirmed demo bookings.
- Minimal dependencies. Prefer reusable components over a complicated architecture.
- No API keys or environment secrets.

### Suggested small component set

`Navbar`, `Hero`, `SpaceCard`, `SpaceFilters`, `AvailabilityPicker`, `BookingDialog`, `BookingSuccess`, `BookingCard`, `Footer`, plus a simple `bookingStore`/hook.

Component names are suggestions; don't create needless abstraction.

## Demo inventory (keep consistent with PRD)

| Category | Unit IDs | Capacity | Demo rate | Duration options |
|---|---|---:|---|---|
| Rest Pod | `REST-01`…`REST-04` | 1 | QAR 15/hour | 1h, 2h |
| Focus Booth | `FOCUS-01`…`FOCUS-06` | 1 | QAR 10/hour | 1h, 2h |
| Group Study Room | `GROUP-01`…`GROUP-02` | 4 | QAR 25/hour | 1h, 2h |
| Shower Suite | `SHOWER-01`…`SHOWER-02` | 1 | QAR 10/30min | 30min |

Sample opening hours: `08:00`–`22:00` (prototype assumptions, not real business hours). Prices always show **QAR**.

## Required booking logic

Keep the logic reliable but simple:

1. When a user picks a category, date, start time and duration, find the first unit in that category without an overlapping **confirmed** booking.
2. Check time overlap with the normal condition: `requestedStart < existingEnd && requestedEnd > existingStart` for bookings on the same date and unit.
3. Don't offer past starts or appointments ending after `22:00`; provide a friendly message for invalid or unavailable times.
4. On confirmation, save a booking containing a unique ID/reference, assigned unit, category, date, start/end, duration, demo price, student display name and `confirmed` status.
5. Persist confirmed and cancelled bookings via `localStorage` and handle an empty/corrupted store gracefully.
6. When a reservation is cancelled, mark it `cancelled` and immediately release that unit/time.
7. Derived availability counts must be consistent with stored bookings and shown as **demo availability**, not a live IoT measurement.
8. Group rooms cannot exceed the sample room capacity of four people.
9. QR: if easy, generate a real QR **graphic** containing just the *demo booking reference*; otherwise use an explicitly labeled **sample QR preview**. It must never suggest a real door will unlock.

You do **not** need a calendar engine, time-zone service, checkout flow or live account system. Keep everything local to the demo browser.

## UX and copy rules

- Always use the brand **QUbe**, not QUnnect, in the interface.
- Suggested tagline: **Your space between classes.**
- Suggested hero headline: **Make the most of your in-between.**
- Suggested subheading: **Rest, focus, and recharge—right where your day takes you.**
- Use clear button labels like **Explore Spaces**, **View & Book**, **Confirm Demo Booking**, **View My Pass** and **Cancel Booking**.
- The primary booking CTA should stand out on every relevant screen.
- Use human-friendly errors, helpful empty states, disabled states when appropriate, and small confirmations/toasts.
- Clearly display the chosen time, duration and total before the user confirms.
- Demo student identity can be prefilled with an obvious example name/email; do not implement fake university verification.
- Show truthful, small-print disclaimers: **concept prototype**, **illustrative prices/availability**, **proposed location**, **sample QR—not real access**, and **no payment collected**.
- Do not suggest the project has launched, has official university approval, owns Stadium 974 containers, or has working hardware.

## Accessibility and responsiveness

- Build for desktop, tablet and mobile widths.
- No horizontal overflow; no tiny modal trapped off-screen.
- Inputs have visible labels; keyboard navigation and visible focus rings work.
- Strong text contrast; don't communicate availability by color alone.
- Buttons and tap targets are comfortable on a phone.
- Honor reduced-motion preferences where possible.
- Use reasonable alt text or mark decorative visuals accordingly.

## Suggested execution order

1. Inspect the repository and read `PRD.md`; identify existing stack/assets.
2. Establish theme, typography, reusable layout and navigation.
3. Build the home page and excellent space cards.
4. Build Explore/Detail flows with functional filters and date/time controls.
5. Implement local booking persistence and overlap checks.
6. Build the confirmation/pass and My Bookings/cancellation journey.
7. Polish responsive behavior, hover/focus states, animations and empty states.
8. Run the app, resolve errors, and manually test the core demo journey.

**Don't stop after scaffolding.** The deliverable is a running prototype that a team can click through during a presentation.

## Final self-check

Before calling the work complete, verify:

- [ ] Home explains QUbe immediately and looks presentation-worthy.
- [ ] Header links and all key CTAs go somewhere useful.
- [ ] All four types of spaces can be explored and booked.
- [ ] Booking date/time and total are correct for the selected duration.
- [ ] A confirmed booking appears in My Bookings, even after refresh.
- [ ] Booking the same remaining unit/time twice is prevented; fully booked inventory shows accurately.
- [ ] Cancellation releases availability.
- [ ] Sample QR pass/reference can be reopened.
- [ ] No real payment, verification, IoT or facility access is claimed.
- [ ] Desktop and mobile both feel intentionally designed.
- [ ] No broken assets, visible console errors or dead-end interactions.

## Delivery notes

When finished, briefly report what was built, how to run it, and any known demo limitations. Avoid overexplaining implementation details. The result should be **simple under the hood and impressive on screen**.

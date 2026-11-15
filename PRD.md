# QUbe — Smart Student Hub
## Product Requirements Document (Website Demo / Prototype)

**Version:** 1.0  
**Product:** QUbe student-space reservation website  
**Stage:** Interactive concept prototype (not a live commercial service)  
**Primary audience:** University students in Qatar  
**Proposed location:** Near Qatar University Metro Station, Doha

---

## 1. The idea

**QUbe turns time between classes into time well spent.** It is a proposed student hub created from repurposed shipping containers, inspired by the reuse potential of Stadium 974's container-based construction. Students can rest, focus, collaborate, or freshen up without going all the way home.

The **website's purpose is simple**: let a student find a suitable space, see demo availability, reserve a time slot, and receive a booking confirmation with a QR-style access pass.

This website should feel like a **credible, beautifully designed startup product**—not a generic college assignment or a complicated enterprise app. The emphasis is on an impressive, fully clickable user experience.

> **Brand line:** *Your space between classes.*
>
> **Supporting line:** *Rest. Focus. Recharge.*

**Naming decision:** Use **QUbe** everywhere in the interface. The project's earlier concept description used “QUnnect”; QUbe is the current website-facing name.

## 2. The problem and value proposition

Students may have long breaks between lectures but limited options to rest privately, study undisturbed, meet with a group, or shower. Returning home takes time, and existing facilities may not meet every need.

QUbe offers:

- **Convenience:** one hub near public transport and university life.
- **Choice:** different types of spaces for different needs.
- **Control:** reserve a suitable time instead of searching for a free room.
- **Comfort:** an approachable, calm, student-first experience.
- **Sustainability:** a modular, container-reuse concept with solar and smart-cooling ambitions.

**Do not** imply QUbe is already operating, has secured a site, is officially endorsed by Qatar University, or has working solar panels, locks, sensors, and payments. Those are elements of the proposed physical business, not capabilities of this demo.

## 3. Demo goals and success criteria

### Must achieve

1. A first-time visitor understands QUbe within **5 seconds** of seeing the home page.
2. A student can complete a **sample reservation in roughly one minute** without creating an account.
3. Visitors can browse different space types, filter by type, choose a date/time, and see meaningful availability feedback.
4. Reservations appear in **My Bookings**, where students can inspect details and cancel them.
5. The interface feels polished and believable on **desktop and mobile**.
6. The website visually connects with the QUbe presentation while looking more modern, inviting, and interactive.

### Out of scope for this prototype

Real login / student verification, real transactions, a payment gateway, live IoT feeds, physical door unlocking, institutional integration, an admin portal, or a production database.

## 4. Main student journey

```text
Home
  → Explore Spaces
  → Choose space type
  → Pick date, start time and duration
  → See availability and total demo price
  → Enter/confirm demo student details
  → Confirm Reservation
  → Receive booking reference + sample QR pass
  → View / cancel in My Bookings
```

A student should always have an obvious next action, a way back, and a clear success state.

## 5. Main pages and experiences

### A. Home — the memorable first impression

**Purpose:** Build excitement and direct users toward reservations.

**Sections, in order:**

1. **Header/navigation:** QUbe wordmark, `Home`, `Explore Spaces`, `My Bookings`, optional `About`, and a standout **Book a Space** button. Keep it clean and responsive.
2. **Hero:** large editorial headline such as **“Make the most of your in-between.”** Subline explaining a calm, flexible student hub near Qatar University Metro Station. Primary CTA **Explore Spaces** and secondary CTA **How It Works**. Feature an architectural visual of a modular container hub or a tasteful illustrated/photographic composition.
3. **Quick availability strip:** selected date, space category and a quick **Find a space** action. Show that reservations are straightforward.
4. **Explore by need:** visually engaging cards for Rest, Focus, Collaborate, and Refresh.
5. **Featured spaces:** three or four cards with space imagery, capacity, amenities, example pricing and availability badges.
6. **How it works:** three simple steps—Choose your space → Pick your time → Get your pass.
7. **QUbe, thoughtfully built:** concise sustainability section highlighting repurposed containers, solar ambitions and smart cooling, without unverified environmental statistics.
8. **Location teaser:** *Proposed near Qatar University Metro Station* with a simple location graphic/map-style design and travel-friendly copy. Clearly say **proposed location**.
9. **Footer:** QUbe branding, quick links, and a discreet **Concept prototype · Not a live booking service** disclosure.

### B. Explore Spaces — browse and decide

**Purpose:** Make finding the right space easy.

- Responsive grid of attractive space cards.
- Tabs/filters: **All**, **Rest**, **Study**, **Group**, **Refresh**.
- Date selector (default: today, when possible) and optional time filter.
- Space cards show image/illustration, name, category, short benefit statement, capacity, amenities, sample price, and availability for the chosen date/time.
- CTA on each card: **View & Book** or **Reserve**.
- Helpful empty state: “No spaces available for this time. Try another slot.”
- Badges such as `Private`, `Popular`, `Seats 4`, or `Available` when accurate for seeded demo data.

**Important distinction:** Some hub areas—such as the prayer room, café, shared lounge and shaded outdoor seating—are **amenities**, not privately reservable spaces in this prototype. Show them in the home/About experience, not as paid booking inventory.

### C. Space Details — confidence before booking

Display a large visual, space name, category, friendly description, amenities, capacity, and sample pricing. Include a clear reservation panel with:

- Date
- Start time
- Duration
- Party size, if relevant for group rooms
- **Check availability / Reserve** action
- Immediately updated **demo total in QAR**

The design should feel like a modern hospitality/booking experience rather than a dense form. Show a notice that availability and prices are **illustrative demo values**.

### D. Reservation + confirmation — the signature interaction

A clean modal, drawer, or step-based page is acceptable as long as it works smoothly on mobile.

**Reservation steps:**

1. Review selected space, date, start time, duration, capacity and total.
2. Provide a demo name and email (or use clearly labeled prefilled demo student details).
3. Press **Confirm Demo Booking**.
4. Show an elegant success screen with a checkmark, booking code, booking details and **sample QR pass**.
5. Provide **View My Bookings** and **Back to Explore** actions.

Show **“Demo only — no payment was taken; this QR does not unlock a real door.”** Never imply a real reservation exists outside the prototype.

### E. My Bookings — the dashboard moment

A compact student dashboard with:

- Upcoming demo bookings listed as polished booking cards.
- Each booking's facility, date, time, duration, sample price, reference and status.
- **View pass** opens the confirmation/QR view again.
- **Cancel booking** asks for confirmation and immediately updates availability.
- Empty state with an inviting **Explore Spaces** button.
- Optional past/cancelled tab if easy to implement.

## 6. Sample inventory and indicative pricing

These are **demo assumptions**, not confirmed business prices or real operating capacity. They can be displayed to make the experience realistic.

| Space type | Inventory (demo units) | Capacity per unit | Example price | Suggested durations |
|---|---:|---:|---|---|
| **Rest Pod** | 4 | 1 | QAR 15 / hour | 1 or 2 hours |
| **Focus Booth** | 6 | 1 | QAR 10 / hour | 1 or 2 hours |
| **Group Study Room** | 2 | 4 | QAR 25 / hour | 1 or 2 hours |
| **Shower Suite** | 2 | 1 | QAR 10 / 30 min | 30 minutes |

**Sample operating window for the demo:** 08:00–22:00 daily. This is not a statement about actual operating hours.

**Amenity previews (not bookable in V1):** relaxation lounge, prayer room, café/vending and shaded outdoor seating.

Each category should have a descriptive, student-friendly identity. For example:

- **Rest Pod:** *A little privacy. A proper reset.*
- **Focus Booth:** *Your quiet corner to get things done.*
- **Group Study Room:** *Good ideas need room to grow.*
- **Shower Suite:** *Freshen up before your next class.*

## 7. Reservation rules for the demo

The demo should behave convincingly, even without a backend:

- Generate distinct units per type (for example `REST-01` through `REST-04`).
- Assign a free physical unit to each confirmed reservation.
- **Never allow overlapping confirmed reservations for the same unit.**
- A category is `Fully booked` only when every unit is occupied for the chosen time range.
- Disallow past time slots; bookings must end within the sample operating hours.
- Price = displayed rate × selected duration, with correct handling of a 30-minute shower slot.
- Save bookings in browser storage so they survive a refresh on the same browser.
- Cancellation changes the status and returns its slot to demo availability.
- Show a well-written message if a chosen slot is no longer available.
- Keep the sample inventory and business rules simple and predictable. No complicated scheduling engine is required.

**“Availability” is simulated based on browser-stored reservations.** Do not label it as a connected real-time sensor feed. A subtle `Demo availability` label is appropriate.

## 8. Brand and visual direction

The website should borrow **visual DNA from the supplied QUbe presentation**, not copy its slide layouts exactly.

### Reference cues from the presentation

- Deep forest-green mastheads and accents.
- White / warm-white background and generous negative space.
- Strong, high-contrast dark headlines.
- Soft **mint**, **powder blue**, and **sand** panels.
- Thin borders, clean rectangular layouts, structured modular blocks.
- A professional, sustainable, approachable personality.

### Suggested UI palette (approximate, adjust by eye)

| Use | Color | Hex |
|---|---|---|
| Primary forest green | QUbe brand, primary buttons, nav emphasis | `#174E3B` |
| Deep ink | Headlines and readable text | `#1E2A25` |
| Warm off-white | Main background | `#FBFCFA` |
| Pale mint | Sustainability, calm accents | `#E2F0E9` |
| Mist blue | Focus/study sections | `#E5EFF5` |
| Soft sand | Social/group/warm highlights | `#F5EBDC` |
| Subtle border | Cards and form elements | `#DCE5DF` |

### How it should feel

**Premium but friendly. Modern but not futuristic. Sustainable but not preachy.** Picture an inviting student lifestyle / boutique hospitality website combined with the clarity of a great booking app.

Design guidance:

- Large, confident typography with concise, human copy.
- Strong hero image or original architectural illustration of a modular container hub.
- Beautiful space imagery (or carefully composed bespoke illustrations if photos are unavailable).
- Cards with restrained rounded corners, subtle shadows and clean spacing.
- Soft hover animations, tasteful transitions, satisfying booking confirmation.
- Visually distinct but coherent categories using mint, blue, sand and green.
- Clear **QAR** prices, recognizable icons, and readable availability labels.
- Mobile-first interactions, accessible color contrast, visible keyboard focus.
- Avoid generic dashboards, excessive gradients, neon colors, overly technical jargon and charts about the project schedule.

## 9. Content tone and important disclosures

**Tone:** calm, confident, warm, student-centered, short and natural.  
**Example CTAs:** `Find My Space`, `Explore Spaces`, `Reserve This Space`, `Confirm Demo Booking`, `View My Pass`.

Use **QUbe**, never QUnnect, in visible website branding.

Display unobtrusive truth-in-demo copy when appropriate:

- `Concept prototype — not a live facility`.
- `Sample pricing and availability for demonstration only`.
- `Proposed location: near Qatar University Metro Station`.
- `QR pass preview — no real door access`.

Do not invent testimonials, partnerships, occupancy metrics, verified environmental claims, a confirmed opening date, or an official Qatar University affiliation.

## 10. Priority list

### P0 — required for the demo

- Polished, responsive home page.
- Browseable space inventory with compelling visuals.
- Functional category filtering, date/time selection and space details.
- Booking flow with realistic validation and confirmation.
- Unique booking reference and visible sample QR/pass.
- My Bookings page, cancellation and local persistence.
- Accurate demo availability after new bookings/cancellations.
- Brand design aligned with the presentation's palette and aesthetic.

### P1 — nice if time allows

- Refined animations and interactive illustrations.
- Favorites/saved spaces.
- Beautiful booking history view.
- Small “How QUbe works” / sustainability explainer.
- Helpful toast notifications and skeleton loading polish (no artificial waiting).

### Not required

Real payments, auth, QR door integration, sensor/solar APIs, admin analytics, subscription billing, complex maps, or backend hosting.

## 11. Acceptance checklist

The prototype is done when a reviewer can:

- [ ] Open the website and immediately identify what QUbe offers.
- [ ] Click from the hero to a space listing.
- [ ] Filter spaces and inspect at least four types.
- [ ] Choose a valid time and create a demo booking.
- [ ] See a success state, booking reference, and sample QR pass.
- [ ] Refresh the page and still find the booking.
- [ ] Open the pass again from My Bookings.
- [ ] Cancel the booking and observe availability update.
- [ ] Encounter a friendly, accurate “fully booked” state after all units for a time are occupied.
- [ ] Complete the main flow on a narrow mobile screen without horizontal scrolling.
- [ ] Recognize the forest-green / mint / blue / sand identity of the reference presentation.
- [ ] Understand this is a concept demo, not a real paid or university-operated service.

---

**Build philosophy:** Make a small number of interactions feel *exceptionally* polished. A beautiful, functional student booking journey is more convincing than many unfinished features.

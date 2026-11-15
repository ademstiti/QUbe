import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CalendarDays,
  Users,
  UserRound,
  MapPin,
  Leaf,
  Moon,
  Sun,
  Droplets,
  Coffee,
  Armchair,
  Menu,
  X,
  Plus,
  Minus,
  Ticket,
  ShieldCheck,
  Sparkles,
  Wind,
  TrainFront,
  CircleHelp,
  AlertCircle,
  Copy,
  Ban,
  BookOpen,
  BatteryCharging,
  Lightbulb,
  LockKeyhole,
  LayoutGrid,
} from "lucide-react";
import QRCode from "qrcode";
import { HubArt, SpaceArt, LocationArt } from "./Artwork";
import {
  SPACES,
  STORE_KEY,
  clockTime,
  createBooking,
  durationLabel,
  freeUnits,
  friendlyDate,
  initialSelection,
  isPastBooking,
  parseBookings,
  priceFor,
  qatarToday,
  readBookings,
  selectionError,
  timeMinutes,
  timeOptions,
  type Booking,
  type Category,
  type Selection,
  type Space,
} from "./booking";

const icons = { rest: Moon, focus: BookOpen, group: Users, shower: Droplets };
const categoryNo = { rest: "01", focus: "02", group: "03", shower: "04" };
const selectionFor = (space: Space, selection: Selection): Selection => ({
  ...selection,
  duration:
    space.id === "shower"
      ? 30
      : selection.duration === 30
        ? 60
        : selection.duration,
  partySize: 1,
});
const navigate = (path: string) => {
  window.location.hash = `/${path}`;
};
function useRoute() {
  const [route, setRoute] = useState(
    () => window.location.hash.slice(2) || "home",
  );
  useEffect(() => {
    const listener = () => {
      setRoute(window.location.hash.slice(2) || "home");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  return route;
}
function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <span className="brand-cube">
        <svg viewBox="0 0 30 32" aria-hidden="true">
          <path d="m3 9 12-7 12 7v14l-12 7-12-7zm0 0 12 7 12-7M15 16v14" />
        </svg>
      </span>
      <span>
        QUbe<span className="brand-dot">.</span>
      </span>
    </span>
  );
}
function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow ${light ? "light" : ""}`}>
      <span />
      {children}
    </p>
  );
}
function ButtonLink({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <a
      href={`#/${href}`}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
    >
      {children}
    </a>
  );
}
function Navbar({ route, count }: { route: string; count: number }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#/home" aria-label="QUbe home">
          <Logo />
        </a>
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <a
            href="#/home"
            className={route === "home" ? "active" : ""}
            aria-current={route === "home" ? "page" : undefined}
          >
            Home
          </a>
          <a
            href="#/spaces"
            className={route.startsWith("spaces") ? "active" : ""}
            aria-current={route.startsWith("spaces") ? "page" : undefined}
          >
            Explore Spaces
          </a>
          <a
            href="#/bookings"
            className={route === "bookings" ? "active" : ""}
            aria-current={route === "bookings" ? "page" : undefined}
          >
            My Bookings{count > 0 && <span className="nav-count">{count}</span>}
          </a>
        </nav>
        <div className="header-end">
          <span className="concept-label">
            <span />A student hub concept
          </span>
          <ButtonLink href="spaces" className="header-book">
            Book a Space <ArrowUpRight size={17} />
          </ButtonLink>
          <button
            className="mobile-menu icon-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <a href="#/home" aria-label="QUbe home">
            <Logo light />
          </a>
          <p>Your space between classes.</p>
        </div>
        <div className="footer-links">
          <a href="#/spaces">
            Explore Spaces <ArrowUpRight size={14} />
          </a>
          <a href="#/bookings">
            My Bookings <ArrowUpRight size={14} />
          </a>
          <a
            href="#/home"
            onClick={() =>
              setTimeout(
                () =>
                  document
                    .getElementById("the-idea")
                    ?.scrollIntoView({ behavior: "smooth" }),
                100,
              )
            }
          >
            The QUbe idea <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-note">
          <MapPin size={17} />
          <p>
            Dreamed up for student life.
            <br />
            <span>Proposed in Doha, Qatar.</span>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} QUbe. A little room for a better day.
        </span>
        <span>Concept prototype · Not a live booking service</span>
      </div>
    </footer>
  );
}
function DateTimeFields({
  selection,
  setSelection,
  space,
  duration = false,
}: {
  selection: Selection;
  setSelection: (s: Selection) => void;
  space?: Space;
  duration?: boolean;
}) {
  const effectiveSpace = space || SPACES[0];
  const options = timeOptions(effectiveSpace, selection);
  const hasCurrent = options.includes(selection.start);
  return (
    <>
      <label className="field">
        <span>
          <CalendarDays size={15} />
          Your date
        </span>
        <input
          aria-label="Your date"
          type="date"
          min={qatarToday()}
          value={selection.date}
          onChange={(e) => setSelection({ ...selection, date: e.target.value })}
          required
        />
      </label>
      <label className="field">
        <span>
          <Clock3 size={15} />
          Start time <small>Qatar time</small>
        </span>
        <span className="select-wrap">
          <select
            aria-label="Start time"
            value={selection.start}
            onChange={(e) =>
              setSelection({ ...selection, start: e.target.value })
            }
          >
            {!hasCurrent && (
              <option value={selection.start} disabled>
                {selection.start} — choose another time
              </option>
            )}
            {options.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
          <ChevronDown size={16} />
        </span>
      </label>
      {duration && (
        <label className="field">
          <span>
            <Clock3 size={15} />
            Duration
          </span>
          <span className="select-wrap">
            <select
              aria-label="Duration"
              value={selection.duration}
              onChange={(e) =>
                setSelection({ ...selection, duration: Number(e.target.value) })
              }
            >
              {(space?.durations || [60, 120]).map((min) => (
                <option key={min} value={min}>
                  {durationLabel(min)}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </span>
        </label>
      )}
    </>
  );
}
function SpaceCard({
  space,
  selection,
  bookings,
}: {
  space: Space;
  selection: Selection;
  bookings: Booking[];
}) {
  const Icon = icons[space.id],
    actualSelection = selectionFor(space, selection),
    error = selectionError(space, actualSelection);
  const count = freeUnits(space, actualSelection, bookings).length;
  return (
    <article className={`space-card category-${space.id}`}>
      <a
        href={`#/spaces/${space.id}`}
        className="card-art-link"
        aria-label={`View ${space.name}`}
      >
        <SpaceArt category={space.id} />
        <span className="art-tag">
          {space.id === "group"
            ? "Room for your people"
            : space.id === "rest"
              ? "Your quiet reset"
              : space.id === "focus"
                ? "Make room for focus"
                : "A fresh perspective"}
        </span>
        <span className="card-art-arrow">
          <ArrowUpRight size={21} />
        </span>
      </a>
      <div className="space-card-body">
        <div className="card-title-row">
          <span className="tiny-category">
            <Icon size={15} />
            {space.filter}
          </span>
          <span className={`availability ${!count ? "unavailable" : ""}`}>
            <span />
            {error
              ? "Pick a valid time"
              : count
                ? `${count} ${count === 1 ? "space" : "spaces"} available`
                : "Fully booked"}
          </span>
        </div>
        <h3>
          <a href={`#/spaces/${space.id}`}>{space.name}</a>
        </h3>
        <p>{space.line}</p>
        <div className="card-amenities">
          <span>
            <Users size={15} />
            {space.capacity === 1 ? "1 person" : "Up to 4 people"}
          </span>
          <span>
            {space.id === "shower" ? (
              <Droplets size={15} />
            ) : (
              <LockKeyhole size={15} />
            )}
            {space.id === "shower" ? "Private suite" : "Your own space"}
          </span>
        </div>
        <div className="card-bottom">
          <div>
            <strong>QAR {space.rate}</strong>
            <span> / {space.rateMinutes === 30 ? "30 min" : "hour"}</span>
          </div>
          <a href={`#/spaces/${space.id}`} className="text-link">
            View & Book <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
function Home({
  selection,
  setSelection,
  bookings,
  setFilter,
}: {
  selection: Selection;
  setSelection: (s: Selection) => void;
  bookings: Booking[];
  setFilter: (f: string) => void;
}) {
  const [quickCategory, setQuickCategory] = useState("all");
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <SectionLabel>A little room for you</SectionLabel>
          <h1>
            Make the most
            <br />
            of your{" "}
            <span className="hero-word">
              in-between
              <svg viewBox="0 0 390 18" aria-hidden="true">
                <path d="M3 13Q174-4 385 8" />
              </svg>
            </span>
            <span className="green-period">.</span>
          </h1>
          <p className="hero-subtitle">
            Rest, focus, and recharge. Thoughtfully designed student spaces,
            right where your day takes you.
          </p>
          <div className="hero-actions">
            <ButtonLink href="spaces">
              Explore Spaces <ArrowUpRight size={19} />
            </ButtonLink>
            <button
              className="button button-plain"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span className="play-circle">
                <ArrowRight size={15} />
              </span>
              How it works
            </button>
          </div>
          <div className="hero-location">
            <MapPin size={17} />
            <span>Proposed near Qatar University Metro Station</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-topline">
            <span>THE QUbe CONCEPT</span>
            <span>DOHA, QATAR ↗</span>
          </div>
          <HubArt />
          <div className="visual-note">
            <span className="visual-note-icon">
              <Leaf size={21} />
            </span>
            <div>
              Repurposed spaces.
              <br />
              <strong>Reimagined possibilities.</strong>
            </div>
          </div>
          <div className="visual-stamp">
            <span>REST · FOCUS</span>
            <span className="stamp-spark">✳</span>
            <span>RECHARGE · REPEAT</span>
          </div>
          <span className="illustration-label">
            An illustration of what could be.
          </span>
        </div>
      </section>
      <section
        className="container quick-book-section"
        aria-label="Quick space finder"
      >
        <form
          className="quick-book"
          onSubmit={(e) => {
            e.preventDefault();
            setFilter(quickCategory);
            navigate("spaces");
          }}
        >
          <div className="quick-book-title">
            <span className="quick-icon">
              <LayoutGrid size={23} />
            </span>
            <div>
              <strong>A break worth booking.</strong>
              <span>Find a little space in your day.</span>
            </div>
          </div>
          <label className="field">
            <span>
              <LayoutGrid size={15} />
              I’m looking for
            </span>
            <span className="select-wrap">
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                aria-label="Space type"
              >
                <option value="all">Any kind of space</option>
                {SPACES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </span>
          </label>
          <label className="field quick-date">
            <span>
              <CalendarDays size={15} />
              When
            </span>
            <input
              aria-label="Visit date"
              type="date"
              min={qatarToday()}
              value={selection.date}
              onChange={(e) =>
                setSelection({ ...selection, date: e.target.value })
              }
              required
            />
          </label>
          <button className="button" type="submit">
            Find a space <ArrowRight size={18} />
          </button>
        </form>
        <p className="quick-caption">
          <ShieldCheck size={13} /> No account needed. No payment collected.
          Just a little room to try.
        </p>
      </section>
      <section className="container needs-section">
        <div className="section-heading">
          <div>
            <SectionLabel>Your day, your way</SectionLabel>
            <h2>
              What do you need
              <br className="mobile-only" /> a little more of?
            </h2>
          </div>
          <p>
            Big plans or a quiet pause.
            <br />
            There’s a QUbe for that.
          </p>
        </div>
        <div className="needs-grid">
          {SPACES.map((space) => {
            const Icon = icons[space.id];
            return (
              <a
                href="#/spaces"
                onClick={() => setFilter(space.id)}
                key={space.id}
                className={`need-tile category-${space.id}`}
              >
                <span className="need-number">{categoryNo[space.id]}</span>
                <Icon size={30} strokeWidth={1.5} />
                <div>
                  <h3>
                    {space.id === "rest"
                      ? "Rest."
                      : space.id === "focus"
                        ? "Focus."
                        : space.id === "group"
                          ? "Connect."
                          : "Refresh."}
                  </h3>
                  <p>{space.need}</p>
                </div>
                <ArrowUpRight className="need-arrow" size={21} />
              </a>
            );
          })}
        </div>
      </section>
      <section className="featured-section" id="spaces">
        <div className="container">
          <div className="section-heading">
            <div>
              <SectionLabel>Small spaces. Big possibilities.</SectionLabel>
              <h2>Make yourself at home.</h2>
            </div>
            <a
              className="text-link"
              href="#/spaces"
              onClick={() => setFilter("all")}
            >
              Explore all spaces <ArrowRight size={18} />
            </a>
          </div>
          <div className="spaces-grid">
            {SPACES.map((s) => (
              <SpaceCard
                key={s.id}
                space={s}
                selection={selection}
                bookings={bookings}
              />
            ))}
          </div>
          <p className="section-footnote">
            Illustrative spaces & prices · Demo availability for{" "}
            {friendlyDate(selection.date)}, {selection.start} ·{" "}
            {durationLabel(selection.duration)} visits / 30-minute showers
          </p>
        </div>
      </section>
      <section className="container how-section" id="how-it-works">
        <div className="how-intro">
          <SectionLabel>Less planning. More living.</SectionLabel>
          <h2>
            Your next good
            <br />
            break starts here.
          </h2>
          <p>
            A little time, a space of your own.
            <br />
            We’ll keep the rest simple.
          </p>
          <ButtonLink href="spaces" secondary>
            Find My Space <ArrowUpRight size={18} />
          </ButtonLink>
        </div>
        <div className="steps">
          {[
            {
              n: "01",
              icon: LayoutGrid,
              title: "Find your kind of space.",
              text: "A quiet corner, a soft landing, or a place to bring everyone together.",
            },
            {
              n: "02",
              icon: CalendarDays,
              title: "Make time for yourself.",
              text: "Pick a date, choose your time, and see your total before you reserve.",
            },
            {
              n: "03",
              icon: Ticket,
              title: "Your pass. Your little pause.",
              text: "Get a sample QR pass and keep your plans handy in My Bookings.",
            },
          ].map((step) => (
            <div className="step" key={step.n}>
              <span className="step-number">{step.n}</span>
              <div>
                <step.icon size={22} strokeWidth={1.6} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container idea-section" id="the-idea">
        <div className="idea-visual">
          <div className="idea-leaf">
            <Leaf size={70} strokeWidth={1} />
          </div>
          <span>
            LESS WASTE.
            <br />
            MORE POSSIBILITY.
          </span>
          <div className="container-lines" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <p>
            Old containers.
            <br />
            <strong>A fresh purpose.</strong>
          </p>
          <span className="idea-star" aria-hidden="true">
            ✳
          </span>
        </div>
        <div className="idea-copy">
          <SectionLabel>Good for your day. Thoughtful by design.</SectionLabel>
          <h2>
            A second life for containers.
            <br />A better break for you.
          </h2>
          <p>
            Inspired by the reuse potential of modular architecture, QUbe
            imagines a new kind of student hub. A smaller footprint, a warmer
            welcome, and a little more care in every corner.
          </p>
          <div className="idea-features">
            <span>
              <Leaf size={18} />
              Container reuse at heart
            </span>
            <span>
              <Sun size={18} />
              Solar-powered ambitions
            </span>
            <span>
              <Wind size={18} />
              Thoughtful cooling plans
            </span>
          </div>
          <p className="small-print">
            A proposed concept. Sustainability features are ambitions for the
            physical hub.
          </p>
        </div>
      </section>
      <section className="container location-section">
        <div className="location-copy">
          <SectionLabel>Close to your everyday</SectionLabel>
          <h2>
            Less of a detour.
            <br />
            More of your day.
          </h2>
          <p>
            A proposed spot near Qatar University Metro Station, designed to fit
            between your commute, your classes, and everything else.
          </p>
          <span className="location-badge">
            <TrainFront size={18} />
            Proposed location · Doha, Qatar
          </span>
          <p className="small-print">
            Illustrative location only. No site or university affiliation
            confirmed.
          </p>
        </div>
        <div className="location-map">
          <LocationArt />
        </div>
      </section>
      <section className="amenities-section">
        <div className="container amenities-inner">
          <p>
            And a little room
            <br />
            <strong>for the everyday.</strong>
          </p>
          <div>
            <span>
              <Armchair />
              Shared lounge
            </span>
            <span>
              <Coffee />
              Café & vending
            </span>
            <span>
              <Sun />
              Shaded seating
            </span>
            <span>
              <Moon />
              Prayer room
            </span>
          </div>
          <small>
            Proposed shared amenities.
            <br />
            No reservation needed in this demo.
          </small>
        </div>
      </section>
    </>
  );
}
function Explore({
  selection,
  setSelection,
  bookings,
  filter,
  setFilter,
}: {
  selection: Selection;
  setSelection: (s: Selection) => void;
  bookings: Booking[];
  filter: string;
  setFilter: (f: string) => void;
}) {
  const spaces = SPACES.filter((s) => filter === "all" || s.id === filter);
  const [availableOnly, setAvailableOnly] = useState(false);
  const shown = spaces.filter(
    (space) =>
      !availableOnly ||
      (!selectionError(space, selectionFor(space, selection)) &&
        freeUnits(space, selectionFor(space, selection), bookings).length > 0),
  );
  return (
    <main className="explore-page container page-main">
      <div className="page-heading">
        <SectionLabel>Find your in-between</SectionLabel>
        <h1>
          A space for every
          <br className="mobile-only" /> kind of day<span>.</span>
        </h1>
        <p>Pick your pace. We’ll help you find your place.</p>
      </div>
      <div className="explore-toolbar">
        <div className="explore-dates">
          <DateTimeFields
            selection={selection}
            setSelection={setSelection}
            duration
          />
        </div>
        <div className="demo-note">
          <span className="status-dot" />
          <div>
            Demo availability<small>Sample hours: 08:00–22:00</small>
          </div>
          <CircleHelp size={16} />
        </div>
      </div>
      <div className="filter-row">
        <div
          className="filter-tabs"
          role="group"
          aria-label="Filter by space type"
        >
          {[{ id: "all", filter: "All spaces" }, ...SPACES].map((s) => (
            <button
              key={s.id}
              className={
                filter === s.id ? "filter-chip selected" : "filter-chip"
              }
              onClick={() => setFilter(s.id)}
              aria-pressed={filter === s.id}
            >
              {s.id === "all" ? (
                <LayoutGrid size={16} />
              ) : (
                (() => {
                  const Icon = icons[s.id as Category];
                  return <Icon size={16} />;
                })()
              )}
              {s.filter}
            </button>
          ))}
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available only
        </label>
      </div>
      <div className="result-count">
        <span>
          {shown.length}{" "}
          {shown.length === 1 ? "kind of space" : "kinds of spaces"} to make
          your own
        </span>
        <span>Illustrative pricing · No payment collected</span>
      </div>
      {shown.length ? (
        <div className="spaces-grid explore-grid">
          {shown.map((s) => (
            <SpaceCard
              key={s.id}
              space={s}
              selection={selection}
              bookings={bookings}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDays />}
          title="A little change of plans?"
          text="No spaces available for this time. Try another slot, date, or space type."
          action={
            <button
              className="button button-secondary"
              onClick={() => {
                setAvailableOnly(false);
                setFilter("all");
              }}
            >
              Show all spaces <ArrowRight size={17} />
            </button>
          }
        />
      )}
      <div className="explore-help">
        <span className="help-icon">
          <Sparkles size={22} />
        </span>
        <div>
          <strong>Every kind of break deserves a place.</strong>
          <p>
            All spaces are private reservations. Shared lounge, prayer room,
            café and outdoor seating are proposed hub amenities.
          </p>
        </div>
      </div>
    </main>
  );
}
function Detail({
  space,
  selection,
  bookings,
  onReserve,
}: {
  space: Space;
  selection: Selection;
  bookings: Booking[];
  onReserve: (space: Space, selection: Selection) => void;
}) {
  const [choice, setChoice] = useState<Selection>(() =>
    selectionFor(space, selection),
  );
  const [showTimes, setShowTimes] = useState(false);
  const error = selectionError(space, choice),
    count = freeUnits(space, choice, bookings).length,
    Icon = icons[space.id];
  const options = timeOptions(space, choice);
  return (
    <main className={`container detail-page page-main category-${space.id}`}>
      <a href="#/spaces" className="back-link">
        <ArrowLeft size={16} />
        Back to spaces
      </a>
      <div className="detail-layout">
        <div className="detail-info">
          <div className="detail-art">
            <SpaceArt category={space.id} />
            <span className="art-tag">
              A QUbe for your{" "}
              {space.id === "rest"
                ? "reset"
                : space.id === "focus"
                  ? "flow"
                  : space.id === "group"
                    ? "people"
                    : "fresh start"}
            </span>
            <span className="art-caption">Illustrative interior</span>
          </div>
          <div className="detail-title">
            <span className="tiny-category">
              <Icon size={17} />
              {space.need}
            </span>
            <h1>
              {space.name}
              <span>.</span>
            </h1>
            <p>{space.line}</p>
          </div>
          <div className="detail-facts">
            <span>
              <Users size={19} />
              {space.capacity === 1 ? "Just for you" : "Up to 4 people"}
            </span>
            <span>
              <LockKeyhole size={19} />
              Private space
            </span>
            <span>
              <Clock3 size={19} />
              {space.id === "shower"
                ? "30-minute visits"
                : "1 or 2-hour visits"}
            </span>
          </div>
          <p className="detail-description">{space.description}</p>
          <h3>A little more comfort.</h3>
          <div className="amenity-list">
            {space.amenities.map((a, i) => {
              const AmenityIcon = [
                Armchair,
                Lightbulb,
                BatteryCharging,
                ShieldCheck,
              ][i];
              return (
                <span key={a}>
                  <AmenityIcon size={19} />
                  {a}
                </span>
              );
            })}
          </div>
          <div className="good-to-know">
            <Leaf size={21} />
            <div>
              <strong>Thoughtfully small. All yours.</strong>
              <p>
                Part of a proposed modular student hub near Qatar University
                Metro Station. Space illustrations, rates and availability are
                for this concept demo.
              </p>
            </div>
          </div>
        </div>
        <aside className="reservation-panel">
          <div className="reservation-head">
            <div>
              <SectionLabel>Make room in your day</SectionLabel>
              <h2>
                Your little{" "}
                {space.id === "rest"
                  ? "reset"
                  : space.id === "focus"
                    ? "focus break"
                    : space.id === "group"
                      ? "get-together"
                      : "refresh"}
                .
              </h2>
            </div>
            <Icon size={28} strokeWidth={1.4} />
          </div>
          <div className="reservation-price">
            <strong>QAR {space.rate}</strong>
            <span> / {space.rateMinutes === 30 ? "30 minutes" : "hour"}</span>
          </div>
          <div className="booking-fields">
            <DateTimeFields
              selection={choice}
              setSelection={setChoice}
              space={space}
              duration
            />
          </div>
          {space.id === "group" && (
            <div className="party-field">
              <div>
                <span>Who’s coming?</span>
                <small>Up to 4 people, including you</small>
              </div>
              <div className="stepper">
                <button
                  aria-label="One fewer person"
                  disabled={choice.partySize <= 1}
                  onClick={() =>
                    setChoice({ ...choice, partySize: choice.partySize - 1 })
                  }
                >
                  <Minus size={15} />
                </button>
                <output aria-live="polite">{choice.partySize}</output>
                <button
                  aria-label="One more person"
                  disabled={choice.partySize >= 4}
                  onClick={() =>
                    setChoice({ ...choice, partySize: choice.partySize + 1 })
                  }
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )}
          <div
            className={`availability-detail ${error || !count ? "has-error" : ""}`}
            aria-live="polite"
          >
            {error || !count ? (
              <AlertCircle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}
            <span>
              {error ||
                (count
                  ? `${count} of ${space.units} spaces available for your time`
                  : "Fully booked for this time. Try another slot.")}
            </span>
          </div>
          <button
            className="text-link other-times"
            onClick={() => setShowTimes(!showTimes)}
            aria-expanded={showTimes}
          >
            {showTimes ? "Hide" : "See"} other available times{" "}
            <ChevronDown size={15} />
          </button>
          {showTimes && (
            <div className="time-grid">
              {options.filter(
                (start) =>
                  freeUnits(space, { ...choice, start }, bookings).length > 0,
              ).length ? (
                options
                  .filter(
                    (start) =>
                      freeUnits(space, { ...choice, start }, bookings).length >
                      0,
                  )
                  .map((start) => (
                    <button
                      key={start}
                      className={choice.start === start ? "selected" : ""}
                      onClick={() => setChoice({ ...choice, start })}
                    >
                      {start}
                    </button>
                  ))
              ) : (
                <p>No available starts. Choose another date.</p>
              )}
            </div>
          )}
          <div className="booking-total">
            <span>
              Demo total
              <small>
                {durationLabel(choice.duration)}
                {!error &&
                  ` · ${choice.start}–${clockTime(timeMinutes(choice.start) + choice.duration)}`}
              </small>
            </span>
            <strong>QAR {priceFor(space, choice.duration)}</strong>
          </div>
          <button
            className="button reserve-button"
            disabled={!!error || !count}
            onClick={() => onReserve(space, choice)}
          >
            Reserve This Space <ArrowUpRight size={18} />
          </button>
          <p className="panel-disclaimer">
            <ShieldCheck size={14} />
            No payment. No account. Just a demo.
          </p>
          <div className="panel-footer">
            <Clock3 size={15} />
            <span>
              Sample hours 08:00–22:00 · Qatar time
              <br />
              Illustrative prices & availability
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}
function Modal({
  children,
  onClose,
  labelId,
}: {
  children: ReactNode;
  onClose: () => void;
  labelId: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={labelId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          className="modal-close icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={21} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
function BookingDialog({
  space,
  selection,
  onClose,
  onConfirm,
}: {
  space: Space;
  selection: Selection;
  onClose: () => void;
  onConfirm: (name: string, email: string) => Promise<void>;
}) {
  const [name, setName] = useState("Aisha — Demo Student"),
    [email, setEmail] = useState("aisha@example.com"),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  return (
    <Modal
      onClose={() => {
        if (!saving) onClose();
      }}
      labelId="review-title"
    >
      <SectionLabel>One little step to your space</SectionLabel>
      <h2 id="review-title">Make it your time.</h2>
      <p className="modal-subtitle">A quick look before you settle in.</p>
      <div className={`review-card category-${space.id}`}>
        <SpaceArt category={space.id} />
        <div>
          <span className="tiny-category">Your chosen space</span>
          <h3>{space.name}</h3>
          <p>
            {friendlyDate(selection.date)} · {selection.start}–
            {clockTime(timeMinutes(selection.start) + selection.duration)}
          </p>
          <p>
            {durationLabel(selection.duration)} · {selection.partySize}{" "}
            {selection.partySize === 1 ? "person" : "people"}
          </p>
        </div>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setError("");
          try {
            await onConfirm(name, email);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "We couldn’t save this booking. Please try again.",
            );
            setSaving(false);
          }
        }}
      >
        <div className="demo-identity-label">
          <UserRound size={15} />
          Example student details <span>Editable</span>
        </div>
        <label className="field">
          <span>Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={80}
            required
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            maxLength={120}
            required
          />
        </label>
        <p className="identity-note">
          Demo details only. No verification or email is sent.
        </p>
        <div className="booking-total">
          <span>
            Your demo total<small>Nothing to pay today</small>
          </span>
          <strong>QAR {priceFor(space, selection.duration)}</strong>
        </div>
        {error && (
          <p role="alert" className="form-error">
            <AlertCircle size={17} />
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="button reserve-button"
        >
          {saving ? "Saving your space…" : "Confirm Demo Booking"}
          <ArrowRight size={18} />
        </button>
        <p className="panel-disclaimer">
          Concept prototype · No payment collected
        </p>
      </form>
    </Modal>
  );
}
function Pass({
  booking,
  onCopy,
}: {
  booking: Booking;
  onCopy: (text: string) => void;
}) {
  const space = SPACES.find((s) => s.id === booking.category)!;
  const [qr, setQr] = useState(""),
    [qrError, setQrError] = useState(false);
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(booking.reference, {
      width: 260,
      margin: 2,
      color: { dark: "#174E3B", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (active) setQr(url);
      })
      .catch(() => {
        if (active) setQrError(true);
      });
    return () => {
      active = false;
    };
  }, [booking.reference]);
  const cancelled = booking.status === "cancelled",
    past = isPastBooking(booking);
  return (
    <main className="pass-page container page-main">
      <div className="success-intro">
        <span className={`success-icon ${cancelled ? "cancelled" : ""}`}>
          {cancelled ? <Ban size={29} /> : <Check size={30} />}
        </span>
        <SectionLabel>
          {cancelled
            ? "A change of plans"
            : past
              ? "A little moment to remember"
              : "A little space, all yours"}
        </SectionLabel>
        <h1>
          {cancelled
            ? "Your booking is cancelled."
            : past
              ? "Your past demo pass."
              : "You’ve made room for you."}
        </h1>
        <p>
          {cancelled
            ? "Your space has been released for someone else’s day."
            : past
              ? "All the details from your earlier demo reservation."
              : "Your demo booking is confirmed. Here’s your little ticket to a better break."}
        </p>
      </div>
      <div className="pass-card">
        <div className={`pass-main category-${space.id}`}>
          <div className="pass-brand-row">
            <Logo light />
            <span>
              {cancelled
                ? "CANCELLED"
                : past
                  ? "PAST DEMO BOOKING"
                  : "YOUR DEMO PASS"}
            </span>
          </div>
          <div className="pass-main-content">
            <span className="pass-category">{space.need}</span>
            <h2>{space.name}</h2>
            <p className="pass-unit">
              <span>{booking.unit}</span>Proposed QUbe · Doha
            </p>
            <div className="pass-detail-grid">
              <div>
                <span>
                  <CalendarDays size={14} />
                  Date
                </span>
                <strong>{friendlyDate(booking.date, true)}</strong>
              </div>
              <div>
                <span>
                  <Clock3 size={14} />
                  Your time
                </span>
                <strong>
                  {booking.start}–{booking.end}
                  <small>Qatar time · {durationLabel(booking.duration)}</small>
                </strong>
              </div>
              <div>
                <span>
                  <UserRound size={14} />
                  Reserved for
                </span>
                <strong>
                  {booking.studentName}
                  <small>
                    {booking.partySize}{" "}
                    {booking.partySize === 1 ? "person" : "people"}
                  </small>
                </strong>
              </div>
              <div>
                <span>
                  <Ticket size={14} />
                  Demo total
                </span>
                <strong>
                  QAR {booking.price}
                  <small>No payment collected</small>
                </strong>
              </div>
            </div>
            <div className="pass-reference">
              <span>BOOKING REFERENCE</span>
              <button
                onClick={() => onCopy(booking.reference)}
                aria-label={`Copy booking reference ${booking.reference}`}
              >
                {booking.reference}
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="pass-qr">
          <div className="qr-label">
            <span className="status-dot" />
            {cancelled ? "Cancelled pass" : "Sample QR preview"}
          </div>
          {cancelled ? (
            <div className="cancelled-qr">
              <Ban size={55} />
              <span>Booking cancelled</span>
            </div>
          ) : qr ? (
            <div className="qr-frame">
              <img
                src={qr}
                alt={`Sample QR containing demo booking reference ${booking.reference}`}
                width="200"
                height="200"
              />
            </div>
          ) : (
            <div className="qr-frame qr-placeholder">
              {qrError
                ? "Your reference is your demo pass."
                : "Preparing your sample QR…"}
            </div>
          )}
          <strong>Your space between classes.</strong>
          <p>
            This QR contains your demo reference.
            <br />
            It does not unlock a real door.
          </p>
          <span className="sample-pill">DEMO ONLY · NO REAL ACCESS</span>
        </div>
      </div>
      <div className="pass-actions">
        <ButtonLink href="bookings">
          View My Bookings <ArrowRight size={18} />
        </ButtonLink>
        <ButtonLink href="spaces" secondary>
          Back to Explore <ArrowUpRight size={18} />
        </ButtonLink>
      </div>
      <p className="pass-disclaimer">
        <ShieldCheck size={15} />
        Demo only — no payment was taken; this QR does not unlock a real door.
      </p>
    </main>
  );
}
function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
function MyBookings({
  bookings,
  onCancel,
}: {
  bookings: Booking[];
  onCancel: (booking: Booking) => void;
}) {
  const [tab, setTab] = useState("upcoming");
  const filtered = bookings
    .filter((b) =>
      tab === "cancelled"
        ? b.status === "cancelled"
        : b.status === "confirmed" &&
          (tab === "past" ? isPastBooking(b) : !isPastBooking(b)),
    )
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
  return (
    <main className="container bookings-page page-main">
      <div className="page-heading bookings-heading">
        <div>
          <SectionLabel>A little time, just for you</SectionLabel>
          <h1>
            Your day. Your spaces<span>.</span>
          </h1>
          <p>All your little pauses, in one place.</p>
        </div>
        <ButtonLink href="spaces">
          Book another space <Plus size={18} />
        </ButtonLink>
      </div>
      <div className="bookings-tabs" role="group" aria-label="Booking status">
        {["upcoming", "past", "cancelled"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            aria-pressed={tab === t}
            key={t}
            onClick={() => setTab(t)}
          >
            {t === "upcoming"
              ? "Upcoming"
              : t === "past"
                ? "Past visits"
                : "Cancelled"}
            <span>
              {
                bookings.filter((b) =>
                  t === "cancelled"
                    ? b.status === "cancelled"
                    : b.status === "confirmed" &&
                      (t === "past" ? isPastBooking(b) : !isPastBooking(b)),
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="bookings-list">
          {filtered.map((booking) => {
            const space = SPACES.find((s) => s.id === booking.category)!;
            return (
              <article
                key={booking.id}
                className={`booking-card category-${space.id}`}
              >
                <a
                  href={`#/pass/${booking.id}`}
                  className="booking-card-art"
                  aria-label={`View pass for ${space.name}`}
                >
                  <SpaceArt category={space.id} />
                </a>
                <div className="booking-card-content">
                  <div className="booking-card-top">
                    <span
                      className={`booking-status ${booking.status === "cancelled" ? "is-cancelled" : ""}`}
                    >
                      {booking.status === "cancelled" ? (
                        <Ban size={13} />
                      ) : (
                        <CheckCircle2 size={13} />
                      )}{" "}
                      {booking.status === "cancelled"
                        ? "Cancelled"
                        : isPastBooking(booking)
                          ? "Past visit"
                          : "Confirmed demo"}
                    </span>
                    <span className="booking-ref">{booking.reference}</span>
                  </div>
                  <h2>
                    {space.name}
                    <span>{booking.unit}</span>
                  </h2>
                  <div className="booking-card-details">
                    <span>
                      <CalendarDays size={16} />
                      {friendlyDate(booking.date)}
                    </span>
                    <span>
                      <Clock3 size={16} />
                      {booking.start}–{booking.end} ·{" "}
                      {durationLabel(booking.duration)}
                    </span>
                    <span>
                      <Users size={16} />
                      {booking.partySize}{" "}
                      {booking.partySize === 1 ? "person" : "people"}
                    </span>
                  </div>
                  <div className="booking-card-bottom">
                    <strong>
                      QAR {booking.price}
                      <small>Demo total · No payment collected</small>
                    </strong>
                    <div>
                      {booking.status === "confirmed" &&
                        !isPastBooking(booking) && (
                          <button
                            className="cancel-link"
                            onClick={() => onCancel(booking)}
                          >
                            Cancel Booking
                          </button>
                        )}
                      <a
                        className="button button-secondary button-small"
                        href={`#/pass/${booking.id}`}
                      >
                        {booking.status === "cancelled"
                          ? "View details"
                          : "View My Pass"}
                        <Ticket size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={
            tab === "cancelled" ? (
              <Ban />
            ) : tab === "past" ? (
              <Clock3 />
            ) : (
              <Ticket />
            )
          }
          title={
            tab === "upcoming"
              ? "Your next good break is waiting."
              : tab === "past"
                ? "Your little pauses will live here."
                : "No changes of plans, yet."
          }
          text={
            tab === "upcoming"
              ? "Find a quiet corner, a comfortable reset, or a little room for your people. Your first demo booking starts here."
              : tab === "past"
                ? "Once a demo visit has ended, you can find its details and pass here."
                : "Cancelled demo bookings will appear here. Your upcoming spaces are still yours."
          }
          action={
            <ButtonLink href="spaces">
              Explore Spaces <ArrowUpRight size={18} />
            </ButtonLink>
          }
        />
      )}
      <p className="bookings-storage-note">
        <ShieldCheck size={16} />
        Your demo bookings are saved in this browser. Use the same browser and
        device to find them again.
      </p>
    </main>
  );
}
export default function App() {
  const route = useRoute();
  const [selection, setSelection] = useState(initialSelection),
    [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      return readBookings();
    } catch {
      return [];
    }
  });
  const [review, setReview] = useState<{
      space: Space;
      selection: Selection;
    } | null>(null),
    [cancel, setCancel] = useState<Booking | null>(null),
    [toast, setToast] = useState(""),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const result = parseBookings(localStorage.getItem(STORE_KEY));
      if (result.recovered)
        setToast(
          "Some saved demo data couldn’t be read. You can still make a fresh booking.",
        );
    } catch {
      setStorageError(true);
    }
    const listener = (e: StorageEvent) => {
      if (e.key === STORE_KEY || e.key === null) {
        try {
          setBookings(readBookings());
        } catch {
          setStorageError(true);
        }
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    setReview(null);
    setCancel(null);
    const title =
      route === "home"
        ? "Your space between classes."
        : route === "spaces"
          ? "Explore Spaces"
          : route === "bookings"
            ? "My Bookings"
            : route.startsWith("pass/")
              ? "Your Demo Pass"
              : SPACES.find((s) => `spaces/${s.id}` === route)?.name ||
                "Find Your Space";
    document.title = `QUbe — ${title}`;
    const main = document.getElementById("main-content");
    main?.focus({ preventScroll: true });
  }, [route]);
  const withLock = async <T,>(work: () => T): Promise<T> =>
    navigator.locks
      ? navigator.locks.request("qube-bookings", () => work())
      : work();
  async function confirmBooking(name: string, email: string) {
    if (!review) return;
    await withLock(() => {
      let latest: Booking[];
      try {
        latest = readBookings();
      } catch {
        throw new Error(
          "Browser storage isn’t available. Enable local storage to keep your demo booking.",
        );
      }
      const booking = createBooking(
        review.space,
        review.selection,
        latest,
        name,
        email,
      );
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify([...latest, booking]));
      } catch {
        throw new Error(
          "Your browser couldn’t save the booking. Please allow site storage or free some browser space and try again.",
        );
      }
      setBookings([...latest, booking]);
      setReview(null);
      navigate(`pass/${booking.id}`);
    });
  }
  async function cancelBooking() {
    if (!cancel) return;
    try {
      await withLock(() => {
        const latest = readBookings();
        const updated = latest.map((b) =>
          b.id === cancel.id ? { ...b, status: "cancelled" as const } : b,
        );
        localStorage.setItem(STORE_KEY, JSON.stringify(updated));
        setBookings(updated);
        setCancel(null);
        setToast("Booking cancelled. A little space has opened up.");
      });
    } catch {
      setToast(
        "We couldn’t save that change. Check browser storage and try again.",
      );
    }
  }
  const space = SPACES.find((s) => `spaces/${s.id}` === route),
    pass = route.startsWith("pass/")
      ? bookings.find((b) => b.id === route.slice(5))
      : undefined;
  let content: ReactNode;
  if (route === "home")
    content = (
      <Home
        selection={selection}
        setSelection={setSelection}
        bookings={bookings}
        setFilter={setFilter}
      />
    );
  else if (route === "spaces")
    content = (
      <Explore
        selection={selection}
        setSelection={setSelection}
        bookings={bookings}
        filter={filter}
        setFilter={setFilter}
      />
    );
  else if (space)
    content = (
      <Detail
        key={space.id}
        space={space}
        selection={selection}
        bookings={bookings}
        onReserve={(space, selection) => setReview({ space, selection })}
      />
    );
  else if (route === "bookings")
    content = <MyBookings bookings={bookings} onCancel={setCancel} />;
  else if (pass)
    content = (
      <Pass
        booking={pass}
        onCopy={async (text) => {
          try {
            await navigator.clipboard.writeText(text);
            setToast("Booking reference copied.");
          } catch {
            setToast(`Your booking reference: ${text}`);
          }
        }}
      />
    );
  else
    content = (
      <main className="container page-main">
        <EmptyState
          icon={<LayoutGrid />}
          title="Let’s find your space."
          text="This page or pass isn’t saved in this browser. Your spaces are just one step away."
          action={
            <ButtonLink href="spaces">
              Explore Spaces <ArrowRight size={18} />
            </ButtonLink>
          }
        />
      </main>
    );
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <Navbar
        route={route}
        count={
          bookings.filter((b) => b.status === "confirmed" && !isPastBooking(b))
            .length
        }
      />
      {storageError && (
        <div className="storage-banner" role="alert">
          Browser storage is unavailable. Enable it to save and keep your demo
          bookings.
        </div>
      )}
      <div
        id="main-content"
        role={route === "home" ? "main" : undefined}
        tabIndex={-1}
      >
        {content}
      </div>
      <Footer />
      {review && (
        <BookingDialog
          space={review.space}
          selection={review.selection}
          onClose={() => setReview(null)}
          onConfirm={confirmBooking}
        />
      )}{" "}
      {cancel && (
        <Modal onClose={() => setCancel(null)} labelId="cancel-title">
          <span className="cancel-modal-icon">
            <CalendarDays size={27} />
          </span>
          <h2 id="cancel-title">A change of plans?</h2>
          <p className="modal-subtitle">
            Cancel your {SPACES.find((s) => s.id === cancel.category)!.name} on{" "}
            {friendlyDate(cancel.date)} at {cancel.start}? The space will become
            available again.
          </p>
          <div className="cancel-actions">
            <button
              className="button button-secondary"
              onClick={() => setCancel(null)}
            >
              Keep my booking
            </button>
            <button className="button button-danger" onClick={cancelBooking}>
              Cancel Booking
            </button>
          </div>
          <p className="panel-disclaimer">
            Demo only. No payment or refund is involved.
          </p>
        </Modal>
      )}
      {toast && (
        <div role="status" className="toast">
          <CheckCircle2 size={19} />
          <span>{toast}</span>
          <button aria-label="Dismiss message" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}

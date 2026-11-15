export type Category = "rest" | "focus" | "group" | "shower";
export type Space = {
  id: Category;
  name: string;
  need: string;
  filter: string;
  prefix: string;
  units: number;
  capacity: number;
  rate: number;
  rateMinutes: number;
  durations: number[];
  line: string;
  description: string;
  amenities: string[];
};
export const SPACES: Space[] = [
  {
    id: "rest",
    name: "Rest Pod",
    need: "A moment to yourself",
    filter: "Rest",
    prefix: "REST",
    units: 4,
    capacity: 1,
    rate: 15,
    rateMinutes: 60,
    durations: [60, 120],
    line: "A little privacy. A proper reset.",
    description:
      "Close the door, settle into a soft daybed, and let the world wait a little. A private, peaceful pause before your next class.",
    amenities: [
      "Comfortable daybed",
      "Adjustable lighting",
      "USB charging",
      "Private space",
    ],
  },
  {
    id: "focus",
    name: "Focus Booth",
    need: "Find your flow",
    filter: "Study",
    prefix: "FOCUS",
    units: 6,
    capacity: 1,
    rate: 10,
    rateMinutes: 60,
    durations: [60, 120],
    line: "Your quiet corner to get things done.",
    description:
      "A desk of your own, a comfortable chair, and room to think. Make headway on that assignment or give your next big idea your full attention.",
    amenities: [
      "Dedicated desk",
      "Quiet setting",
      "Power outlets",
      "Task lighting",
    ],
  },
  {
    id: "group",
    name: "Group Study Room",
    need: "Better ideas, together",
    filter: "Group",
    prefix: "GROUP",
    units: 2,
    capacity: 4,
    rate: 25,
    rateMinutes: 60,
    durations: [60, 120],
    line: "Good ideas need room to grow.",
    description:
      "Bring your people and spread out. A welcoming room for group projects, shared revision, and the conversations that move things forward.",
    amenities: ["Seats up to 4", "Whiteboard", "Shared table", "Power outlets"],
  },
  {
    id: "shower",
    name: "Shower Suite",
    need: "Start fresh, again",
    filter: "Refresh",
    prefix: "SHOWER",
    units: 2,
    capacity: 1,
    rate: 10,
    rateMinutes: 30,
    durations: [30],
    line: "Freshen up before your next class.",
    description:
      "From your morning commute to an afternoon on campus, make a little space to freshen up. A private shower and changing area, all to yourself.",
    amenities: [
      "Private shower",
      "Changing area",
      "Mirror & vanity",
      "30-minute session",
    ],
  },
];
export type Booking = {
  id: string;
  reference: string;
  unit: string;
  category: Category;
  date: string;
  start: string;
  end: string;
  duration: number;
  price: number;
  partySize: number;
  studentName: string;
  studentEmail: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
};
export type Selection = {
  date: string;
  start: string;
  duration: number;
  partySize: number;
};
export const STORE_KEY = "qube.bookings.v1";
export const timeMinutes = (time: string) =>
  Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
export const clockTime = (mins: number) =>
  `${Math.floor(mins / 60)
    .toString()
    .padStart(2, "0")}:${(mins % 60).toString().padStart(2, "0")}`;
export const durationLabel = (mins: number) =>
  mins === 30 ? "30 min" : `${mins / 60} ${mins === 60 ? "hour" : "hours"}`;
export const priceFor = (space: Space, duration: number) =>
  (space.rate * duration) / space.rateMinutes;
export function qatarToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Qatar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((key) => parts.find((p) => p.type === key)!.value)
    .join("-");
}
export function initialSelection(now = new Date()): Selection {
  let date = qatarToday(now);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Qatar",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const minute =
    Number(parts.find((p) => p.type === "hour")!.value) * 60 +
    Number(parts.find((p) => p.type === "minute")!.value);
  let next = Math.max(480, Math.ceil((minute + 1) / 30) * 30);
  if (next > 1260) {
    date = qatarToday(
      new Date(new Date(`${date}T12:00:00+03:00`).getTime() + 86400000),
    );
    next = 480;
  }
  return { date, start: clockTime(next), duration: 60, partySize: 1 };
}
export const friendlyDate = (date: string, long = false) =>
  new Date(`${date}T12:00:00+03:00`).toLocaleDateString("en-GB", {
    timeZone: "Asia/Qatar",
    weekday: long ? "long" : "short",
    day: "numeric",
    month: long ? "long" : "short",
    ...(long ? { year: "numeric" } : {}),
  });
const validDate = (date: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) &&
  !Number.isNaN(Date.parse(`${date}T12:00:00+03:00`)) &&
  qatarToday(new Date(`${date}T12:00:00+03:00`)) === date;
export function selectionError(
  space: Space,
  selection: Selection,
  now = new Date(),
): string | null {
  if (!validDate(selection.date)) return "Choose a date for your visit.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(selection.start))
    return "Choose a start time for your visit.";
  if (!space.durations.includes(selection.duration))
    return "Choose one of the available durations.";
  const start = timeMinutes(selection.start);
  if (start % 30 !== 0 || start < 480 || start + selection.duration > 1320)
    return "Choose a time between 08:00 and 22:00, with room for your full visit.";
  if (
    new Date(`${selection.date}T${selection.start}:00+03:00`).getTime() <=
    now.getTime()
  )
    return "That time has already passed. Pick a later time or another day.";
  if (
    !Number.isInteger(selection.partySize) ||
    selection.partySize < 1 ||
    selection.partySize > space.capacity
  )
    return `This space welcomes up to ${space.capacity} ${space.capacity === 1 ? "person" : "people"}.`;
  return null;
}
export function freeUnits(
  space: Space,
  selection: Selection,
  bookings: Booking[],
): string[] {
  const start = timeMinutes(selection.start),
    end = start + selection.duration;
  return Array.from(
    { length: space.units },
    (_, i) => `${space.prefix}-${String(i + 1).padStart(2, "0")}`,
  ).filter(
    (unit) =>
      !bookings.some(
        (b) =>
          b.status === "confirmed" &&
          b.date === selection.date &&
          b.unit === unit &&
          start < timeMinutes(b.end) &&
          end > timeMinutes(b.start),
      ),
  );
}
export function timeOptions(
  space: Space,
  selection: Selection,
  now = new Date(),
) {
  return Array.from({ length: 28 }, (_, i) => clockTime(480 + i * 30)).filter(
    (start) =>
      !selectionError(space, { ...selection, start, partySize: 1 }, now),
  );
}
export function parseBookings(raw: string | null): {
  bookings: Booking[];
  recovered: boolean;
} {
  if (!raw) return { bookings: [], recovered: false };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { bookings: [], recovered: true };
    const bookings = parsed.filter((b: Booking) => {
      if (!b || typeof b !== "object") return false;
      const space = SPACES.find((s) => s.id === b.category);
      if (
        !space ||
        !validDate(b.date) ||
        typeof b.start !== "string" ||
        typeof b.end !== "string"
      )
        return false;
      return (
        typeof b.id === "string" &&
        /^QU-[A-Z0-9]{10}$/.test(b.reference) &&
        Array.from(
          { length: space.units },
          (_, i) => `${space.prefix}-${String(i + 1).padStart(2, "0")}`,
        ).includes(b.unit) &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(b.start) &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(b.end) &&
        timeMinutes(b.start) >= 480 &&
        timeMinutes(b.start) % 30 === 0 &&
        timeMinutes(b.end) <= 1320 &&
        space.durations.includes(b.duration) &&
        timeMinutes(b.end) - timeMinutes(b.start) === b.duration &&
        b.price === priceFor(space, b.duration) &&
        Number.isInteger(b.partySize) &&
        b.partySize >= 1 &&
        b.partySize <= space.capacity &&
        typeof b.studentName === "string" &&
        !!b.studentName.trim() &&
        typeof b.studentEmail === "string" &&
        (b.status === "confirmed" || b.status === "cancelled") &&
        typeof b.createdAt === "string"
      );
    });
    return { bookings, recovered: bookings.length !== parsed.length };
  } catch {
    return { bookings: [], recovered: true };
  }
}
export function readBookings(): Booking[] {
  return parseBookings(localStorage.getItem(STORE_KEY)).bookings;
}
export function createBooking(
  space: Space,
  selection: Selection,
  bookings: Booking[],
  studentName: string,
  studentEmail: string,
  now = new Date(),
): Booking {
  const error = selectionError(space, selection, now);
  if (error) throw new Error(error);
  if (
    !studentName.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim())
  )
    throw new Error("Please add your name and a valid email for this demo.");
  const unit = freeUnits(space, selection, bookings)[0];
  if (!unit)
    throw new Error(
      "This time just filled up. Try another time for a little more room.",
    );
  const id = crypto.randomUUID();
  return {
    id,
    reference: `QU-${id.replaceAll("-", "").slice(0, 10).toUpperCase()}`,
    unit,
    category: space.id,
    ...selection,
    end: clockTime(timeMinutes(selection.start) + selection.duration),
    price: priceFor(space, selection.duration),
    studentName: studentName.trim(),
    studentEmail: studentEmail.trim(),
    status: "confirmed",
    createdAt: now.toISOString(),
  };
}
export function isPastBooking(booking: Booking, now = new Date()) {
  return (
    new Date(`${booking.date}T${booking.end}:00+03:00`).getTime() <=
    now.getTime()
  );
}

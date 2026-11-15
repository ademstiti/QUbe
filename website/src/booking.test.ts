import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SPACES,
  createBooking,
  freeUnits,
  initialSelection,
  parseBookings,
  priceFor,
  qatarToday,
  selectionError,
  timeOptions,
  type Selection,
  type Booking,
} from "./booking.ts";

const now = new Date("2028-01-10T07:01:00+03:00");
const slot: Selection = {
  date: "2028-01-10",
  start: "10:00",
  duration: 60,
  partySize: 1,
};
const student = ["Demo Student", "student@example.com"] as const;
test("inventory matches all four PRD categories and rates", () => {
  assert.deepEqual(
    SPACES.map((s) => [s.prefix, s.units, s.capacity]),
    [
      ["REST", 4, 1],
      ["FOCUS", 6, 1],
      ["GROUP", 2, 4],
      ["SHOWER", 2, 1],
    ],
  );
  assert.deepEqual(
    SPACES.map((s) => priceFor(s, s.durations[0])),
    [15, 10, 25, 10],
  );
  assert.deepEqual(
    SPACES.slice(0, 3).map((s) => priceFor(s, 120)),
    [30, 20, 50],
  );
});
test("assigns distinct units and prevents a third overlapping group booking", () => {
  const space = SPACES[2];
  const first = createBooking(space, slot, [], ...student, now);
  const second = createBooking(space, slot, [first], ...student, now);
  assert.equal(first.unit, "GROUP-01");
  assert.equal(second.unit, "GROUP-02");
  assert.notEqual(first.reference, second.reference);
  assert.equal(freeUnits(space, slot, [first, second]).length, 0);
  assert.throws(
    () => createBooking(space, slot, [first, second], ...student, now),
    /filled up/,
  );
});
test("prevents partial overlaps, contained intervals, and intervals spanning an existing booking", () => {
  const space = SPACES[0];
  const booking = createBooking(
    space,
    { ...slot, duration: 120 },
    [],
    ...student,
    now,
  );
  for (const selection of [
    { ...slot, start: "09:30" },
    { ...slot, start: "10:30" },
    { ...slot, start: "11:30" },
    { ...slot, start: "09:30", duration: 120 },
  ])
    assert.equal(
      freeUnits(space, selection, [booking]).includes(booking.unit),
      false,
    );
});
test("allows adjacent starts and identical times on a different date", () => {
  const space = SPACES[0],
    booking = createBooking(space, slot, [], ...student, now);
  assert.equal(
    freeUnits(space, { ...slot, start: "11:00" }, [booking]).length,
    4,
  );
  assert.equal(
    freeUnits(space, { ...slot, start: "09:00" }, [booking]).length,
    4,
  );
  assert.equal(
    freeUnits(space, { ...slot, date: "2028-01-11" }, [booking]).length,
    4,
  );
});
test("cancellation immediately releases the exact unit", () => {
  const space = SPACES[2],
    booking = createBooking(space, slot, [], ...student, now);
  assert.equal(freeUnits(space, slot, [booking]).length, 1);
  const cancelled = { ...booking, status: "cancelled" as const };
  assert.equal(freeUnits(space, slot, [cancelled]).length, 2);
  assert.equal(
    createBooking(space, slot, [cancelled], ...student, now).unit,
    booking.unit,
  );
});
test("each category can be completely booked with accurate counts", () => {
  for (const space of SPACES) {
    const bookings: Booking[] = [];
    const selection = { ...slot, duration: space.durations[0] };
    for (let i = 0; i < space.units; i++) {
      bookings.push(createBooking(space, selection, bookings, ...student, now));
      assert.equal(
        freeUnits(space, selection, bookings).length,
        space.units - i - 1,
      );
    }
    assert.throws(() =>
      createBooking(space, selection, bookings, ...student, now),
    );
  }
});
test("validates past dates, starts, opening hours, closing boundary, and half-hour steps", () => {
  const space = SPACES[0];
  assert.match(
    selectionError(space, { ...slot, date: "2028-01-09" }, now)!,
    /passed/,
  );
  assert.match(
    selectionError(
      space,
      { ...slot, start: "08:00" },
      new Date("2028-01-10T08:00:00+03:00"),
    )!,
    /passed/,
  );
  assert.match(
    selectionError(space, { ...slot, start: "07:30" }, now)!,
    /08:00/,
  );
  assert.match(
    selectionError(space, { ...slot, start: "21:30" }, now)!,
    /22:00/,
  );
  assert.match(
    selectionError(space, { ...slot, start: "10:15" }, now)!,
    /08:00/,
  );
  assert.equal(selectionError(space, { ...slot, start: "21:00" }, now), null);
  assert.equal(
    selectionError(SPACES[3], { ...slot, start: "21:30", duration: 30 }, now),
    null,
  );
});
test("group capacity is limited to four and single spaces to one", () => {
  assert.equal(selectionError(SPACES[2], { ...slot, partySize: 4 }, now), null);
  for (const count of [0, 5, 1.5])
    assert.match(
      selectionError(SPACES[2], { ...slot, partySize: count }, now)!,
      /up to 4/,
    );
  assert.match(
    selectionError(SPACES[0], { ...slot, partySize: 2 }, now)!,
    /up to 1/,
  );
});
test("shower duration is fixed and prices handle thirty minutes correctly", () => {
  const space = SPACES[3];
  assert.match(selectionError(space, slot, now)!, /duration/);
  const booking = createBooking(
    space,
    { ...slot, duration: 30 },
    [],
    ...student,
    now,
  );
  assert.equal(booking.end, "10:30");
  assert.equal(booking.price, 10);
});
test("Qatar date and next start handle midnight and end of day", () => {
  assert.equal(qatarToday(new Date("2028-01-09T22:00:00Z")), "2028-01-10");
  assert.deepEqual(initialSelection(new Date("2028-01-10T10:01:00+03:00")), {
    date: "2028-01-10",
    start: "10:30",
    duration: 60,
    partySize: 1,
  });
  assert.deepEqual(initialSelection(new Date("2028-01-10T21:01:00+03:00")), {
    date: "2028-01-11",
    start: "08:00",
    duration: 60,
    partySize: 1,
  });
});
test("time options exclude past starts and visits extending past closing", () => {
  const starts = timeOptions(
    SPACES[0],
    slot,
    new Date("2028-01-10T10:01:00+03:00"),
  );
  assert.equal(starts[0], "10:30");
  assert.equal(starts.at(-1), "21:00");
  assert.equal(
    timeOptions(SPACES[0], { ...slot, duration: 120 }, now).at(-1),
    "20:00",
  );
});
test("rejects invalid calendar dates and malformed times", () => {
  for (const date of ["2028-02-30", "", "garbage"])
    assert.match(selectionError(SPACES[0], { ...slot, date }, now)!, /date/);
  for (const start of ["25:00", "10:99", ""])
    assert.match(
      selectionError(SPACES[0], { ...slot, start }, now)!,
      /start time/,
    );
});
test("store safely handles empty, malformed, and partially corrupt records", () => {
  assert.deepEqual(parseBookings(null), { bookings: [], recovered: false });
  for (const data of ["{bad", "null", "{}", "[null,{},1]"])
    assert.deepEqual(parseBookings(data), { bookings: [], recovered: true });
  const booking = createBooking(SPACES[0], slot, [], ...student, now);
  assert.deepEqual(parseBookings(JSON.stringify([booking])).bookings, [
    booking,
  ]);
  assert.deepEqual(
    parseBookings(JSON.stringify([booking, {}, null])).bookings,
    [booking],
  );
  assert.equal(
    parseBookings(JSON.stringify([{ ...booking, price: 1000 }])).bookings
      .length,
    0,
  );
  assert.equal(
    parseBookings(JSON.stringify([{ ...booking, unit: "REST-99" }])).bookings
      .length,
    0,
  );
  assert.equal(
    parseBookings(JSON.stringify([{ ...booking, status: "cancelled" }]))
      .bookings[0].status,
    "cancelled",
  );
});
test("student details must be present and valid", () => {
  assert.throws(
    () => createBooking(SPACES[0], slot, [], " ", "bad", now),
    /name and a valid email/,
  );
});

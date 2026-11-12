const assert = require("assert");
const E = require("../engine.js");
const FAKE = require("../fake.js");
const REAL = require("../places.json");
const T = E.toMin;
let pass = 0; function test(n, f) { try { f(); pass++; console.log("ok  -", n); } catch (e) { console.log("FAIL-", n, e.message); process.exitCode = 1; } }
const base = { date: "2026-12-05", startTime: "08:00", endTime: "21:00", interests: ["history","architecture","museum","culture","market","food","nightlife","religious","local_life","park"], budget: "medium", startArea: null, mobility: "easy", group: "couple", evening: true, maxStops: 6 };
const byId = Object.fromEntries(FAKE.map(p => [p.id, p]));
function check(r) {
  const stops = r.items.filter(i => i.type === "stop");
  let last = -1;
  for (const s of stops) {
    const p = byId[s.placeId];
    assert.ok(E.isPlannable(p), s.placeId + " not plannable");
    assert.ok(T(s.start) >= last, "overlap"); last = T(s.end);
    if (!E.isExterior(p)) {
      const rs = E.rangesFor(p, r.weekday);
      assert.ok(rs && rs.some(x => T(s.start) >= x[0] && T(s.end) <= x[1]), s.placeId + " outside opening range " + s.start + "-" + s.end);
    }
  }
  r.items.filter(i => i.type === "travel").forEach(t => assert.ok(t.minutes >= 0));
  return stops;
}
test("real data today: TOO_FEW_PLACES, no padding", () => { const r = E.plan(base, REAL); assert.equal(r.failure.code, "TOO_FEW_PLACES"); assert.equal(r.items.length, 0); });
test("fake data produces a plan", () => { const r = E.plan(base, FAKE); assert.ok(!r.failure, JSON.stringify(r.failure)); assert.ok(check(r).length >= 3); });
test("temporarily closed / unknown hours never scheduled", () => { for (const d of ["2026-12-05","2026-12-07","2026-12-08"]) { const s = check(E.plan({...base, date: d}, FAKE)); assert.ok(!s.some(x => x.placeId === "test-l" || x.placeId === "test-j")); } });
test("closed-day exclusion (C closed Monday)", () => { const r = E.plan({...base, date: "2026-12-07"}, FAKE); assert.ok(!check(r).some(x => x.placeId === "test-c")); });
test("split ranges honoured, never past closing", () => { for (let h = 7; h < 15; h++) check(E.plan({...base, startTime: (h<10?"0":"")+h+":15"}, FAKE)); });
test("deterministic", () => { assert.deepEqual(E.plan(base, FAKE), E.plan(base, FAKE)); });
test("evening block: after 18:00 only evening places", () => { const s = check(E.plan(base, FAKE)); s.filter(x => T(x.start) >= T("18:00")).forEach(x => assert.ok(byId[x.placeId].evening_friendly)); });
test("evening off: nothing after 18:00", () => { const s = check(E.plan({...base, evening: false}, FAKE)); s.forEach(x => assert.ok(T(x.end) <= T("18:00"))); });
test("NO_EVENING_PLACES notice", () => { const r = E.plan(base, FAKE.map(p => ({...p, evening_friendly: false}))); assert.ok(r.notices.includes("NO_EVENING_PLACES")); });
test("lunch window inserted", () => { const r = E.plan(base, FAKE); const m = r.items.find(i => i.type === "meal" && i.kind === "lunch"); assert.ok(m && T(m.start) >= T("11:30") && T(m.end) <= T("13:30") + 1, JSON.stringify(m)); });
console.log(pass + " passed");
console.log(JSON.stringify(E.plan(base, FAKE).items.map(i => i.type === "stop" ? `${i.start}-${i.end} ${i.placeId}` : i.type === "meal" ? `${i.start}-${i.end} ${i.kind}` : `  ~${i.minutes}m`), null, 0));

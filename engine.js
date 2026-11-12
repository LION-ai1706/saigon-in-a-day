/* Saigon in a Day — deterministic itinerary engine (spec section B4).
   Pure functions, no network. Same input + same places => same output. */
var ENGINE = (function () {
  var CONFIG = {
    speedKmh: 15,          // effective city speed for the rough travel estimate
    bufferMin: 10,         // added to every transfer
    minPlannable: 8,       // MIN_PLANNABLE_FOR_PLAN
    maxWaitMin: 30,        // waiting longer than this for opening disqualifies a stop
    exteriorMinutes: 20,   // fixed length of an outside-only photo stop
    lunch: { from: "11:30", to: "13:30", min: 45, max: 60 },
    dinner: { from: "18:00", to: "20:00", len: 60 },
    eveningFrom: "18:00",
    dataOldDays: 90,
    cityCentre: { lat: 10.7769, lng: 106.7009 }, // example value given in the spec (B6), used only as a start point
    maxStopsDefault: 5,
    maxStopsHard: 6,
    mealNearKm: 2
  };
  var DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var COST = { free: 0, low: 1, medium: 2, high: 3 };
  var MOBILITY_FLAGS = ["stairs", "long_walk", "uneven"];

  function toMin(s) { var a = s.split(":"); return (+a[0]) * 60 + (+a[1]); }
  function fromMin(m) { m = Math.round(m); var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm; }
  function weekday(iso) { return DAYS[new Date(iso + "T00:00:00Z").getUTCDay()]; }
  function km(a, b) {
    var R = 6371, r = Math.PI / 180;
    var dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function travelMinutes(a, b) { return Math.round(km(a, b) / CONFIG.speedKmh * 60) + CONFIG.bufferMin; }

  // null = unknown (NOT closed); [] = closed; otherwise list of [open, close] in minutes
  function rangesFor(p, day) {
    var h = p.opening_hours ? p.opening_hours[day] : null;
    if (h === "closed") return [];
    if (!Array.isArray(h)) return null;
    return h.map(function (r) { return [toMin(r[0]), toMin(r[1])]; });
  }
  function isExterior(p) { return p.data_status === "exterior_only_verify"; }
  function visitLen(p) { return isExterior(p) ? CONFIG.exteriorMinutes : p.typical_visit_minutes; }

  // What stops a place from being plannable at all (independent of the visitor's choices)
  function missingFor(p) {
    var m = [];
    if (p.data_status === "temporarily_closed") m.push("TEMPORARILY_CLOSED");
    else if (p.data_status === "needs_data") m.push("NEEDS_DATA");
    if (!isExterior(p) && p.data_status !== "temporarily_closed" && p.hours_confidence !== "high" && p.hours_confidence !== "medium") m.push("HOURS_CONFIDENCE_LOW");
    if (p.lat == null || p.lng == null) m.push("NO_COORDINATES");
    if (!isExterior(p) && p.typical_visit_minutes == null) m.push("NO_VISIT_MINUTES");
    return m;
  }
  function isPlannable(p) { return missingFor(p).length === 0; }

  function interestMatch(p, interests) {
    var n = 0; (p.categories || []).forEach(function (c) { if (interests.indexOf(c) >= 0) n++; });
    return Math.min(n, 2);
  }
  function openForVisit(p, day, ws, we) {
    if (isExterior(p)) return { ok: true };
    var rs = rangesFor(p, day);
    if (rs === null) return { ok: false, why: "HOURS_UNKNOWN_DAY" };
    if (rs.length === 0) return { ok: false, why: "CLOSED_DAY" };
    var len = visitLen(p);
    for (var i = 0; i < rs.length; i++) {
      var s = Math.max(rs[i][0], ws), e = Math.min(rs[i][1], we);
      if (len == null ? e > s : e - s >= len) return { ok: true };
    }
    return { ok: false, why: "NOT_OPEN_IN_WINDOW" };
  }
  function fitsBudget(p, budget) {
    if (p.cost_level == null) return budget === "free" ? { ok: false, why: "PRICE_UNKNOWN" } : { ok: true, warn: true };
    return COST[p.cost_level] <= COST[budget] ? { ok: true } : { ok: false, why: "OVER_BUDGET" };
  }
  function fitsMobility(p, mobility) {
    if (mobility !== "limited" || !p.mobility_note) return true;
    var n = String(p.mobility_note).toLowerCase();
    return !MOBILITY_FLAGS.some(function (f) { return n.indexOf(f) >= 0; });
  }
  function isOfficial(p) { return (p.source_urls || []).some(function (u) { return /\.gov\.vn\//.test(u + "/"); }); }
  function baseScore(p, interests) { return 3 * interestMatch(p, interests) + (isOfficial(p) ? 1 : 0) + (p.hours_confidence === "high" ? 1 : 0); }

  function daysBetween(a, b) { return Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000); }

  function stopWarnings(p, today, budgetWarn) {
    var w = [];
    if (isExterior(p)) w.push("EXTERIOR_ONLY");
    if (p.data_status === "partial") w.push("PARTIAL_CHECK_HOURS");
    if (p.hours_confidence === "medium") w.push("HOURS_MEDIUM_CONFIDENCE");
    if (p.price_recently_changed || /from 2026-10-01|resolution/i.test(p.ticket_note || "")) w.push("PRICE_CHANGED_RECENTLY");
    if (p.last_entry || /ticket counter closes/i.test(p.hours_note || "")) w.push("LAST_ENTRY_EARLY");
    if (budgetWarn) w.push("PRICE_NOT_VERIFIED");
    if (p.last_verified && today && daysBetween(p.last_verified, today) > CONFIG.dataOldDays) w.push("DATA_OLD");
    return w;
  }

  /* Why does a place not reach the plan for this visitor? (for the honest "near matches" list) */
  function explain(p, input) {
    var day = weekday(input.date), ws = toMin(input.startTime), we = toMin(input.endTime);
    var reasons = missingFor(p).slice();
    var o = openForVisit(p, day, ws, we); if (!o.ok) reasons.push(o.why);
    var b = fitsBudget(p, input.budget); if (!b.ok) reasons.push(b.why);
    if (!fitsMobility(p, input.mobility)) reasons.push("MOBILITY");
    return reasons;
  }

  function plan(input, places, opts) {
    opts = opts || {};
    var today = opts.today || null;
    var day = weekday(input.date);
    var start = toMin(input.startTime);
    var dayEnd = toMin(input.endTime);
    var eveFrom = toMin(CONFIG.eveningFrom);
    if (!input.evening) dayEnd = Math.min(dayEnd, eveFrom);
    var maxStops = Math.min(input.maxStops || CONFIG.maxStopsDefault, CONFIG.maxStopsHard);
    var interests = input.interests || [];

    var interestHits = places.filter(function (p) { return interests.length === 0 || interestMatch(p, interests) > 0; });
    var budgetWarn = {};
    var cands = interestHits.filter(function (p) {
      if (!isPlannable(p)) return false;
      if (!openForVisit(p, day, start, dayEnd).ok) return false;
      var b = fitsBudget(p, input.budget); if (!b.ok) return false; if (b.warn) budgetWarn[p.id] = true;
      return fitsMobility(p, input.mobility);
    }).sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; });

    var base = {
      id: null, generatedAt: opts.now || null, input: input, weekday: day, items: [],
      notices: ["TRAFFIC_NOTE"], matchedPlaceIds: cands.map(function (p) { return p.id; })
    };

    if (cands.length < CONFIG.minPlannable) {
      var allClosed = interestHits.length > 0 && interestHits.every(function (p) {
        if (isExterior(p)) return false;
        var rs = rangesFor(p, day); return rs === null || rs.length === 0 || p.data_status === "temporarily_closed";
      });
      base.failure = { code: allClosed ? "ALL_CLOSED" : (interestHits.length === 0 ? "NO_MATCH" : "TOO_FEW_PLACES"), matchedPlaceIds: base.matchedPlaceIds };
      base.nearMatches = interestHits.filter(function (p) { return cands.indexOf(p) < 0; })
        .map(function (p) { return { placeId: p.id, reasons: explain(p, input) }; });
      return base;
    }

    var lunchFrom = toMin(CONFIG.lunch.from), lunchTo = toMin(CONFIG.lunch.to), lunchLatest = lunchTo - CONFIG.lunch.min;
    var dinFrom = toMin(CONFIG.dinner.from), dinLatest = toMin(CONFIG.dinner.to) - CONFIG.dinner.len;
    var lunchDone = !(start <= lunchLatest && dayEnd >= lunchFrom + CONFIG.lunch.min);
    var dinnerDone = !(input.evening && start <= dinLatest && dayEnd >= dinFrom + CONFIG.dinner.len);
    var t = start, pos = input.startArea || CONFIG.cityCentre, posId = "start", used = {}, items = [], stops = 0, travelTotal = 0;

    function meal(kind, len) {
      var near = cands.filter(function (c) { return !used[c.id] && c.meal_capable === true && km(pos, c) <= CONFIG.mealNearKm; })[0];
      items.push({ type: "meal", kind: kind, start: fromMin(t), end: fromMin(t + len), suggestion: near ? { placeId: near.id } : "ask_hotel" });
      t += len;
    }

    for (var guard = 0; guard < 40 && stops < maxStops && t < dayEnd; guard++) {
      if (!lunchDone && t >= lunchFrom) {
        if (t <= lunchLatest) meal("lunch", Math.max(CONFIG.lunch.min, Math.min(CONFIG.lunch.max, lunchTo - t)));
        lunchDone = true; continue;
      }
      if (!dinnerDone && t >= dinFrom) {
        if (t <= dinLatest) meal("dinner", CONFIG.dinner.len);
        dinnerDone = true; continue;
      }
      var best = null;
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i]; if (used[c.id]) continue;
        var tr = travelMinutes(pos, c), arr = t + tr, len = visitLen(c), s = null;
        if (isExterior(c)) s = arr;
        else {
          var rs = rangesFor(c, day);
          for (var j = 0; j < rs.length; j++) {
            var st = Math.max(arr, rs[j][0]);
            if (st - arr <= CONFIG.maxWaitMin && st + len <= rs[j][1]) { s = st; break; }
          }
        }
        if (s === null) continue;
        var e = s + len;
        if (e > dayEnd) continue;
        if (s >= eveFrom && c.evening_friendly !== true) continue;          // evening block: evening places only
        if (!lunchDone && e > lunchLatest) continue;                         // keep room for lunch
        if (!dinnerDone && e > dinLatest) continue;                          // keep room for dinner
        var sc = baseScore(c, interests) - 0.5 * (km(pos, c) / 3);
        if (!best || sc > best.sc + 1e-9) best = { c: c, s: s, e: e, tr: tr, sc: sc };
      }
      if (!best) {
        if (!lunchDone && t < lunchFrom) { t = lunchFrom; continue; }
        if (!dinnerDone && t < dinFrom) { t = dinFrom; continue; }
        break;
      }
      var c2 = best.c;
      items.push({ type: "travel", from: posId, to: c2.id, minutes: best.tr });
      travelTotal += best.tr;
      var reasons = [];
      var hit = (c2.categories || []).filter(function (x) { return interests.indexOf(x) >= 0; });
      if (hit.length) reasons.push({ code: "MATCHES", values: hit });
      if (best.s > t + best.tr) reasons.push({ code: "WAIT_FOR_OPENING", values: [fromMin(best.s)] });
      items.push({ type: "stop", placeId: c2.id, start: fromMin(best.s), end: fromMin(best.e), reasons: reasons, warnings: stopWarnings(c2, today, budgetWarn[c2.id]) });
      used[c2.id] = true; stops++; t = best.e; pos = c2; posId = c2.id;
    }
    if (!lunchDone && t >= lunchFrom && t <= lunchLatest) meal("lunch", CONFIG.lunch.min);

    if (input.evening && !cands.some(function (c) { return c.evening_friendly === true; })) base.notices.push("NO_EVENING_PLACES");
    base.items = items;
    if (stops === 0) { base.failure = { code: "NO_MATCH", matchedPlaceIds: base.matchedPlaceIds }; return base; }
    var stopItems = items.filter(function (x) { return x.type === "stop"; });
    base.summary = {
      stops: stops,
      verifiedSources: stopItems.reduce(function (n, x) { var p = cands.filter(function (c) { return c.id === x.placeId; })[0]; return n + (p.source_urls || []).length; }, 0),
      totalWalkOrTravelMinutes: travelTotal
    };
    // stable id derived from the input, so the same input gives the same id
    var str = JSON.stringify(input), h = 2166136261;
    for (var k = 0; k < str.length; k++) { h ^= str.charCodeAt(k); h = Math.imul(h, 16777619); }
    base.id = (h >>> 0).toString(36);
    return base;
  }

  return { CONFIG: CONFIG, DAYS: DAYS, plan: plan, isPlannable: isPlannable, missingFor: missingFor, rangesFor: rangesFor,
    weekday: weekday, toMin: toMin, fromMin: fromMin, explain: explain, travelMinutes: travelMinutes, isExterior: isExterior };
})();
if (typeof module !== "undefined") module.exports = ENGINE;

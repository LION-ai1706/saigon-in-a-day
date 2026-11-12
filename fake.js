/* FICTIONAL TEST DATA. These places do not exist. They are used only to show how a full
   plan looks once enough real places are verified, and in the engine tests. */
var FAKE_PLACES = (function () {
  function wk(r, opts) {
    opts = opts || {};
    var o = {};
    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].forEach(function (d) { o[d] = opts[d] !== undefined ? opts[d] : r; });
    return o;
  }
  function P(id, letter, cats, lat, lng, hours, extra) {
    var base = {
      id: "test-" + id, fictional: true,
      name_en: "Test place " + letter + " (fictional)", name_vi: "Địa điểm thử " + letter + " (hư cấu)",
      categories: cats, description_en: "Fictional test place used to demonstrate the planner. It does not exist.",
      address_vi: "Không có thật, chỉ là dữ liệu thử", address_en: "Not a real address (test data)", area: null,
      lat: lat, lng: lng, coords_source: "fictional test data",
      opening_hours: hours, hours_confidence: "high", hours_note: "Fictional hours.",
      typical_visit_minutes: 60, visit_minutes_source: "fictional", cost_level: "low", ticket_adult_vnd: null,
      ticket_note: "Fictional.", evening_friendly: false, mobility_note: null, meal_capable: false,
      data_status: "ready", status_note: "Fictional test data.", source_urls: [], last_verified: "2026-11-02", verified_by: "test fixture"
    };
    for (var k in extra || {}) base[k] = extra[k];
    return base;
  }
  return [
    P("a", "A", ["history", "museum"], 10.7790, 106.6955, wk([["07:30", "17:00"]]), { typical_visit_minutes: 90 }),
    P("b", "B", ["history", "architecture"], 10.7800, 106.6990, wk([["08:00", "11:30"], ["13:00", "17:00"]]), { typical_visit_minutes: 60, hours_confidence: "medium", data_status: "partial" }),
    P("c", "C", ["culture", "museum"], 10.7740, 106.7040, wk([["08:00", "17:00"]], { mon: "closed" }), { typical_visit_minutes: 75 }),
    P("d", "D", ["architecture"], 10.7798, 106.7000, wk([["07:00", "19:00"]]), { typical_visit_minutes: 30, cost_level: "free" }),
    P("e", "E", ["market", "food", "local_life"], 10.7725, 106.6980, wk([["06:00", "19:00"]]), { typical_visit_minutes: 45, meal_capable: true, cost_level: "free" }),
    P("f", "F", ["religious", "culture"], 10.7530, 106.6610, wk([["06:30", "11:30"], ["13:30", "17:00"]]), { typical_visit_minutes: 40, cost_level: "free" }),
    P("g", "G", ["nightlife", "local_life"], 10.7745, 106.7035, wk([["17:00", "23:00"]]), { typical_visit_minutes: 60, evening_friendly: true, cost_level: "free" }),
    P("h", "H", ["nightlife", "architecture"], 10.7715, 106.7045, wk([["09:30", "21:30"]]), { typical_visit_minutes: 45, evening_friendly: true, cost_level: "medium" }),
    P("i", "I", ["park", "local_life"], 10.7875, 106.7050, wk([["07:00", "18:00"]]), { typical_visit_minutes: 60 }),
    P("j", "J", ["history", "museum"], 10.7770, 106.6930, wk(null), { hours_confidence: null, data_status: "needs_data" }),
    P("k", "K", ["architecture", "religious"], 10.7797, 106.6992, wk(null), { data_status: "exterior_only_verify", typical_visit_minutes: null, cost_level: "free", hours_confidence: null }),
    P("l", "L", ["culture", "market"], 10.7500, 106.6500, wk([["08:00", "16:00"]]), { typical_visit_minutes: 50, data_status: "temporarily_closed" })
  ];
})();
if (typeof module !== "undefined") module.exports = FAKE_PLACES;

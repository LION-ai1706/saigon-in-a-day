const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/39b4af05-d1c9-4b0d-a0b0-056d9cde44ca_4eb71864-2afd-43c2-9681-30971171c892/pptx/scripts/apply_theme.js");
const IMG = "/mnt/project-files/saigon-in-a-day/pitch-deck/";
const OUT = process.argv[2] || "deck.pptx";

const THEME = {
  name: "Saigon in a Day",
  headFontFace: "Arial", bodyFontFace: "Arial",
  colors: { dk1: "14212B", lt1: "FFFFFF", dk2: "07402F", lt2: "E3F1EC",
    accent1: "0B6B4F", accent2: "B7791F", accent3: "FDF3E1", accent4: "6BB59A",
    accent5: "C97A6B", accent6: "E2B45F", hlink: "0B6B4F", folHlink: "5B6872" },
};
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Saigon in a Day – Pitch Deck (HIST 2026)";
pres.author = "Lion";
const C = pres.SchemeColor;
const MUT = "5B6872", LINE = "D9E1E5", AMBT = "7A4F0E";
const W = 13.333, M = 0.6, CW = W - 2 * M;

pres.defineSlideMaster({
  title: "Title dark", background: { color: THEME.colors.dk2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.0, w: 11, h: 1.1, fontSize: 54, bold: true, color: C.background1, align: "left", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "Content", background: { color: THEME.colors.lt1 },
  margin: [0.5, M, 0.6, M],
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: M, y: 0.4, w: 8, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.72, w: CW, h: 1.05, fontSize: 30, bold: true, color: C.text1, align: "left", valign: "top", margin: 0 }, text: "" } },
    { text: { text: "Saigon in a Day · HIST 2026", options: { x: M, y: 7.05, w: 6, h: 0.25, fontSize: 10, color: MUT, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.5, y: 7.05, w: 0.5, h: 0.25, fontSize: 10, color: MUT, align: "right" },
});

let n = 0;
const nm = (s) => `${s}-${++n}`;
function card(s, x, y, w, h, tint) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, objectName: nm("card"),
    fill: { color: tint ? C.background2 : C.background1 }, line: { color: tint ? THEME.colors.lt2 : LINE, width: 1.25 } });
}
function fillbox(s, x, y, w, h, runs, size = 13) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, objectName: nm("placeholder-box"),
    fill: { color: C.accent3 }, line: { color: C.accent2, width: 1.25, dashType: "dash" } });
  s.addText(runs, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2, fontSize: size, color: AMBT, valign: "top", margin: 0, isTextBox: true, objectName: nm("placeholder-text"), paraSpaceAfter: 3 });
}
function t(s, runs, x, y, w, h, o = {}) {
  s.addText(runs, Object.assign({ x, y, w, h, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: nm("text") }, o));
}
const B = (text, o = {}) => ({ text, options: Object.assign({ bold: true }, o) });
const R = (text, o = {}) => ({ text, options: o });
const F = (text) => ({ text, options: { bold: true, color: AMBT, highlight: "FDF3E1" } });
function bullets(items, size = 14) {
  return items.map((it, i) => {
    const runs = Array.isArray(it) ? it : [R(it)];
    return runs.map((r, j) => ({ text: r.text, options: Object.assign({ fontSize: size }, r.options,
      j === 0 ? { bullet: { indent: 14 } } : {}, j === runs.length - 1 && i < items.length - 1 ? { breakLine: true } : {}) }));
  }).flat();
}
function tag(s, label, x, y, amber) {
  const w = 0.12 * label.length * 0.75 + 0.35;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.28, rectRadius: 0.14, objectName: nm("tag"), fill: { color: amber ? C.accent3 : C.background2 }, line: { type: "none" } });
  t(s, label.toUpperCase(), x, y, w, 0.28, { fontSize: 9, bold: true, color: amber ? AMBT : C.accent1, align: "center", valign: "middle", charSpacing: 1 });
}
function content(sec, kicker, title) {
  const s = pres.addSlide({ masterName: "Content", sectionTitle: sec });
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  return s;
}
const Y0 = 1.95; // content top

// 1 TITLE
pres.addSection({ title: "Opening" });
{
  const s = pres.addSlide({ masterName: "Title dark", sectionTitle: "Opening" });
  s.addShape(pres.shapes.OVAL, { x: M, y: 1.0, w: 0.75, h: 0.75, fill: { color: C.background1 }, line: { type: "none" }, objectName: "badge" });
  t(s, "1d", M, 1.0, 0.75, 0.75, { fontSize: 22, bold: true, color: C.text2, align: "center", valign: "middle" });
  s.addText("Saigon in a Day", { placeholder: "title" });
  t(s, "One day in Saigon, planned from official sources.", M, 3.15, 11, 0.5, { fontSize: 24, color: "BFE3D6" });
  t(s, "Một ngày Sài Gòn, đúng nguồn, đúng gu.", M, 3.7, 11, 0.45, { fontSize: 19, color: "8CC9B3" });
  t(s, [R("A bilingual planning assistant for short-stay international visitors to Ho Chi Minh City", { breakLine: true }),
    R("Pitch deck for HIST 2026 · Theme: Digital transformation and AI in tourism", { breakLine: true }),
    R("Lion, founder · "), R("[contact email / phone]", { color: "F2C879", bold: true })],
    M, 4.7, 11, 1.2, { fontSize: 15, color: "D7ECE5", paraSpaceAfter: 6 });
  t(s, "Version 1 · November 2026", M, 6.95, 4, 0.3, { fontSize: 10, color: "8CC9B3" });
  t(s, "Independent student project. Not affiliated with or endorsed by any government body or venue.", 5.2, 6.95, W - M - 5.2, 0.3, { fontSize: 10, color: "8CC9B3", align: "right" });
}

// 2 PROBLEM
pres.addSection({ title: "Problem and solution" });
{
  const s = content("Problem and solution", "01 · PROBLEM", "Short-stay visitors plan their one day in Saigon from scattered, often outdated information");
  const items = [["Scattered sources", "Visitors who stay one or two days piece together a route from blogs, social posts and general-purpose AI chatbots."],
    ["Wrong or outdated details", "Opening hours, prices and closures change. Chatbots can confidently suggest places that are closed or do not exist."],
    ["Lost time, same few sites", "Routes cut across heavy traffic, and visitors default to the same famous landmarks. Smaller museums and local experiences are rarely found."]];
  const cw = (CW - 0.6) / 3;
  items.forEach(([h, p], i) => { const x = M + i * (cw + 0.3); card(s, x, Y0, cw, 2.4);
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: Y0 + 0.3, w: 0.45, h: 0.45, fill: { color: C.accent1 }, line: { type: "none" }, objectName: nm("num") });
    t(s, String(i + 1), x + 0.3, Y0 + 0.3, 0.45, 0.45, { fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle" });
    t(s, h, x + 0.3, Y0 + 0.9, cw - 0.6, 0.35, { fontSize: 17, bold: true });
    t(s, p, x + 0.3, Y0 + 1.3, cw - 0.6, 1.0, { fontSize: 14 }); });
  card(s, M, 4.65, CW, 1.6, true);
  t(s, [B("Real examples from our own data research (Nov 2026): "), R("the Ho Chi Minh Museum branch at Nhà Rồng has been closed for renovation since 7 May 2026; the Notre-Dame Cathedral interior was reported closed for restoration; and four city museums changed their adult fee to 60,000 VND from 1 October 2026, while older guides still show other hours and prices.")],
    M + 0.3, 4.85, CW - 0.6, 1.25, { fontSize: 15 });
}

// 3 WHY IT MATTERS
{
  const s = content("Problem and solution", "02 · WHY IT MATTERS", "The city is growing fast and has made digital tourism a stated priority");
  const st = [["~8.6M", "international visitors to Ho Chi Minh City in 2025, up 40.3%"], ["~46M", "domestic visitors in 2025, up 20%"], ["US$10.6B", "tourism revenue (VND 278,566 billion), up 45.8%"]];
  const cw = (CW - 0.6) / 3;
  st.forEach(([v, l], i) => { const x = M + i * (cw + 0.3); card(s, x, Y0, cw, 1.85);
    t(s, v, x + 0.3, Y0 + 0.25, cw - 0.6, 0.8, { fontSize: 40, bold: true, color: C.accent1 });
    t(s, l, x + 0.3, Y0 + 1.1, cw - 0.6, 0.6, { fontSize: 14 }); });
  const hw = (CW - 0.3) / 2;
  [["City ambition", "Become Asia's leading creative tourism hub by 2030, focusing on high-value visitors, green tourism and digital tourism."],
   ["What this means for us", "At this volume, even a small improvement in trip planning can extend stays, spread spending to more sites and strengthen the city's reputation."]]
    .forEach(([h, p], i) => { const x = M + i * (hw + 0.3); card(s, x, 4.1, hw, 1.75, true);
      t(s, h, x + 0.3, 4.3, hw - 0.6, 0.35, { fontSize: 17, bold: true });
      t(s, p, x + 0.3, 4.7, hw - 0.6, 1.0, { fontSize: 14 }); });
  t(s, "Source: Sai Gon Giai Phong (SGGP), \"Ho Chi Minh City welcomes nearly 8.6 million international visitors in 2025\", 31 December 2025.", M, 6.5, CW, 0.3, { fontSize: 10, color: MUT });
}

// 4 SOLUTION
{
  const s = content("Problem and solution", "03 · SOLUTION", "A timed one-day plan built only from places we have verified");
  const steps = [["Ask.", "Interests, budget, hotel area, date and time window, mobility, group type, optional evening."],
    ["Select.", "Draw only from a curated database built from official public sources. Nothing outside it is ever suggested."],
    ["Order.", "Arrange stops by location, opening hours and travel time into a timed plan with a lunch window."],
    ["Show.", "English guidance plus Vietnamese names and addresses on a \"show to driver\" card."],
    ["Correct.", "Visitors report wrong information; we check and fix the database."]];
  steps.forEach(([h, p], i) => { const y = Y0 + i * 0.95;
    s.addShape(pres.shapes.OVAL, { x: M, y, w: 0.42, h: 0.42, fill: { color: C.accent1 }, line: { type: "none" }, objectName: nm("step") });
    t(s, String(i + 1), M, y, 0.42, 0.42, { fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle" });
    t(s, [B(h + " "), R(p)], M + 0.6, y + 0.02, 5.4, 0.85, { fontSize: 14 }); });
  const x = 6.95, w = W - M - x;
  card(s, x, Y0, w, 4.65, true);
  t(s, "Trust by design", x + 0.35, Y0 + 0.3, w - 0.7, 0.4, { fontSize: 18, bold: true });
  t(s, bullets(["Every stop shows its source link and a \"last verified\" date.",
    "Warnings for closed days, renovations and conflicting sources.",
    "When we do not have a verified answer, the assistant says so instead of guessing.",
    "A deterministic planning engine does the work. An AI layer is optional and is never allowed to add places, prices or hours."], 15),
    x + 0.35, Y0 + 0.85, w - 0.7, 3.6, { paraSpaceAfter: 10 });
}

// 5 PRODUCT
pres.addSection({ title: "Product and market" });
{
  const s = content("Product and market", "04 · PRODUCT", "A working mobile-first prototype, built and tested");
  // phones: screenshots 780x1560 px => 1:2
  [["home.png", "Prototype home screen"], ["place.png", "Place page with verification status"]].forEach(([f, alt], i) => {
    const x = M + i * 2.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: Y0 - 0.05, w: 2.2, h: 4.24, rectRadius: 0.15, fill: { color: "1D2A33" }, line: { type: "none" }, objectName: nm("phone"),
      shadow: { type: "outer", color: "000000", opacity: 0.18, blur: 8, offset: 3, angle: 90 } });
    s.addImage({ path: IMG + f, x: x + 0.08, y: Y0 + 0.03, w: 2.04, h: 4.08, altText: alt, objectName: nm("screenshot") });
  });
  const x = 5.8, w = W - M - x;
  t(s, "What is built (prototype v1, November 2026)", x, Y0, w, 0.4, { fontSize: 17, bold: true });
  t(s, bullets(["Questionnaire and timed day planner", "Place pages with sources, verification status and warnings",
    "\"Show to driver\" card with Vietnamese name and address", "\"Report wrong information\" button and short anonymous survey",
    "Data status page that shows openly what is and is not verified", "Deterministic planning engine with 10 automated tests"], 14),
    x, Y0 + 0.5, w, 2.5, { paraSpaceAfter: 5 });
  fillbox(s, x, 4.75, w, 1.6, [B("Honest status: "), R("real plans switch on once at least 8 places have verified coordinates and visit times. Until then, the planner says it does not have enough data, and a preview labelled \"fictional test data\" shows how a full plan looks.", { breakLine: true }),
    B("Demo link: "), F("[paste public prototype link after sharing]")]);
}

// 6 LANDSCAPE
{
  const s = content("Product and market", "05 · LANDSCAPE AND ADVANTAGE", "Others present information or generate plans. We plan from verified local data.");
  const H = (x) => ({ text: x, options: { bold: true, fontSize: 10, color: MUT, charSpacing: 1 } });
  const yes = (x) => ({ text: x, options: { bold: true, color: C.accent1 } });
  const no = (x) => ({ text: x, options: { color: "AA3333" } });
  const mu = (x) => ({ text: x, options: { color: MUT } });
  const rows = [
    [H("OPTION TODAY"), H("TIMED DAY PLAN"), H("VISIBLE SOURCES AND DATES"), H("LIMITS (FROM PUBLIC REPORTS)")],
    [{ text: [B("Official channels", { breakLine: true }), R("3D/360 tourism map, reported tourism chatbot", { fontSize: 11, color: MUT })] }, { text: [R("Not observed yet ", { color: MUT }), F("[test]")] }, mu("Official content"), "Focus on presenting information about sites; planning features not yet tested by us"],
    [{ text: [B("Global AI planners and chatbots")] }, yes("Yes"), no("No"), "Reviews point to accuracy and trust gaps; no verified local database"],
    [{ text: [B("Blogs, social, review sites")] }, no("Partly"), no("Rarely"), "Rich but scattered and often outdated"],
    [{ text: [B("Local human guides")] }, yes("Yes"), mu("Personal knowledge"), "Reliable but costly and fixed in schedule"],
    [{ text: [B("Saigon in a Day")], options: { fill: { color: THEME.colors.lt2 } } }, { text: "Yes", options: { bold: true, color: C.accent1, fill: { color: THEME.colors.lt2 } } }, { text: "Yes, every stop", options: { bold: true, color: C.accent1, fill: { color: THEME.colors.lt2 } } },
      { text: [B("Hard to copy: "), R("the verified local dataset, a correction loop from real visitor feedback, and relationships with sites and hotels built during the pilot")], options: { fill: { color: THEME.colors.lt2 } } }],
  ];
  s.addTable(rows, { x: M, y: Y0, w: CW, colW: [3.1, 1.9, 2.2, CW - 7.2], fontSize: 13, color: THEME.colors.dk1, fontFace: "Arial",
    border: { type: "solid", pt: 0.75, color: LINE }, valign: "middle", margin: [5, 8, 5, 8], objectName: "landscape-table" });
  t(s, "Sources: Tuoi Tre News (3D/360 map, Dec 2023); Doanh Nghiep Hoi Nhap (tourism chatbot, Sep 2023); Hospitality Today (AI travel tools reliability, 21 Aug 2025). We will test the official channels with real questions before the screening round and update this slide.",
    M, 6.35, CW, 0.5, { fontSize: 10, color: MUT });
}

// 7 MARKET
{
  const s = content("Product and market", "06 · MARKET", "Start with one clear user in one city, then grow through hotels and tour operators");
  const cw = (CW - 0.6) / 3, h = 3.05;
  card(s, M, Y0, cw, h, true); tag(s, "Context", M + 0.3, Y0 + 0.25);
  t(s, "~8.6M", M + 0.3, Y0 + 0.7, cw - 0.6, 0.75, { fontSize: 40, bold: true, color: C.accent1 });
  t(s, "international visitors to HCMC in 2025 (SGGP). This is the wider pool, not our addressable market.", M + 0.3, Y0 + 1.5, cw - 0.6, 1.2, { fontSize: 14 });
  [["Beachhead users", "Short-stay independent visitors", "First-time international travellers on a one or two-day stay who do not speak Vietnamese.", "Share of visitors who stay 1–2 days: "],
   ["Paying customers", "Hotels and tour operators", "Businesses that answer \"what should I do today?\" for their guests every day.", "Number of hotels / tour operators in central HCMC: "]]
    .forEach(([tg, hd, p, fb], i) => { const x = M + (i + 1) * (cw + 0.3); card(s, x, Y0, cw, h); tag(s, tg, x + 0.3, Y0 + 0.25);
      t(s, hd, x + 0.3, Y0 + 0.7, cw - 0.6, 0.3, { fontSize: 15, bold: true, fit: "none" });
      t(s, p, x + 0.3, Y0 + 1.1, cw - 0.6, 0.9, { fontSize: 13 });
      fillbox(s, x + 0.3, Y0 + 2.1, cw - 0.6, 0.75, [R(fb), F("[find a published source]")], 12); });
  card(s, M, 5.3, CW, 1.15);
  t(s, [B("Secondary beneficiaries: "), R("museums, cultural sites, small local businesses and evening experiences gain visibility. Later, city tourism bodies could gain anonymised, privacy-respecting insight into visitor interests. "),
    R("Market sizing will be filled only with sourced figures; we do not estimate without data.", { color: MUT })], M + 0.3, 5.45, CW - 0.6, 0.9, { fontSize: 14 });
}

// 8 BUSINESS MODEL
pres.addSection({ title: "Business" });
{
  const s = content("Business", "07 · BUSINESS MODEL", "Free for travellers. Hotels and tour operators pay.");
  const cw = (CW - 0.9) / 4, h = 2.6;
  [["Travellers", "Free", [R("The full planner, driver cards and sources at no cost. Trust is the product; no paywall between a visitor and correct information.")], true],
   ["Main revenue", "B2B white-label plans", [R("Hotels and tour operators offer the planner to guests under their own brand, by QR code at reception or in pre-arrival messages.")]],
   ["Secondary", "Featured listings", [R("Verified local businesses can pay for visibility, always "), B("clearly labelled"), R(" as featured and never ranked above the visitor's own needs.")]],
   ["Later", "Anonymised insights", [R("Aggregate trends on visitor interests for partners. No personal data collected or sold.")]]]
    .forEach(([tg, hd, p, tint], i) => { const x = M + i * (cw + 0.3); card(s, x, Y0, cw, h, tint); tag(s, tg, x + 0.25, Y0 + 0.22);
      t(s, hd, x + 0.25, Y0 + 0.65, cw - 0.5, 0.35, { fontSize: 15, bold: true });
      t(s, p, x + 0.25, Y0 + 1.05, cw - 0.5, 1.5, { fontSize: 13 }); });
  const hw = (CW - 0.3) / 2, y = 4.85;
  card(s, M, y, hw, 1.6);
  t(s, "First step: pilot with 3–5 hotels", M + 0.3, y + 0.2, hw - 0.6, 0.35, { fontSize: 16, bold: true });
  t(s, "Offer the planner free during the pilot, measure guest use and satisfaction, then agree a paid plan with the hotels that see value.", M + 0.3, y + 0.6, hw - 0.6, 0.9, { fontSize: 14 });
  fillbox(s, M + hw + 0.3, y, hw, 1.6, [B("Prices to validate in the pilot (assumptions):", { breakLine: true }),
    R("White-label: 1.5M VND per partner per month + 2M setup fee", { breakLine: true }), R("Featured listing: 500k VND per month", { breakLine: true }),
    R("Pilot hotels confirmed: "), F("[0 of 3–5 so far — update]")], 13);
}

// 9 TRACTION
{
  const s = content("Business", "08 · TRACTION", "Early stage, stated honestly: product built, data started, users next");
  const cw = (CW - 0.9) / 4;
  [["1", "working prototype with a tested planning engine"], ["15", "places researched from official and news sources, with links and dates"],
   ["1", "place fully verified so far (Independence Palace); 5 partly verified"], ["0", "real users or partners yet. The pilot starts next."]]
    .forEach(([v, l], i) => { const x = M + i * (cw + 0.3); card(s, x, Y0, cw, 1.75);
      t(s, v, x + 0.25, Y0 + 0.2, cw - 0.5, 0.7, { fontSize: 38, bold: true, color: C.accent1 });
      t(s, l, x + 0.25, Y0 + 0.95, cw - 0.5, 0.75, { fontSize: 13 }); });
  t(s, "Data status of the 15 places (2 Nov 2026)", M, 3.95, CW, 0.3, { fontSize: 12, color: MUT });
  const seg = [[1, C.accent1, "1 verified"], [5, C.accent4, "5 partial"], [7, "C9D4D9", "7 need data"], [1, C.accent6, "1 exterior only"], [1, C.accent5, "1 temporarily closed"]];
  let x = M; seg.forEach(([k, col]) => { const w = CW * k / 15; s.addShape(pres.shapes.RECTANGLE, { x, y: 4.3, w, h: 0.28, fill: { color: col }, line: { color: C.background1, width: 1 }, objectName: nm("status-bar") }); x += w; });
  let lx = M; seg.forEach(([k, col, lab]) => { s.addShape(pres.shapes.RECTANGLE, { x: lx, y: 4.73, w: 0.14, h: 0.14, fill: { color: col }, line: { type: "none" }, objectName: nm("legend") });
    t(s, lab, lx + 0.2, 4.67, 2.2, 0.26, { fontSize: 11, color: MUT }); lx += 0.4 + lab.length * 0.085; });
  const hw = (CW - 0.3) / 2;
  fillbox(s, M, 5.15, hw, 1.4, [B("Pilot results to add (only real numbers):", { breakLine: true }), R("Visitors surveyed: "), F("[n]"), R(" · found one-day planning difficult: "), F("[x%]"),
    R(" · met wrong information online: "), F("[y%]"), R(" · rated our plan realistic: "), F("[z%]"), R(" · NPS: "), F("[ ]")]);
  fillbox(s, M + hw + 0.3, 5.15, hw, 1.4, [B("Partner progress to add:", { breakLine: true }), R("Hotels contacted / interested / piloting: "), F("[ ] / [ ] / [ ]"), R("", { breakLine: true }),
    R("Places verified on site: "), F("[ ]"), R(" · Error reports fixed: "), F("[ ]")]);
}

// 10 TEAM
pres.addSection({ title: "Team, financials and plan" });
{
  const s = content("Team, financials and plan", "09 · TEAM", "A founder who works directly with the target user");
  const hw = (CW - 0.3) / 2, h = 4.6;
  card(s, M, Y0, hw, h);
  s.addShape(pres.shapes.OVAL, { x: M + 0.3, y: Y0 + 0.3, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "founder-avatar" });
  t(s, "L", M + 0.3, Y0 + 0.3, 0.7, 0.7, { fontSize: 22, bold: true, color: C.background1, align: "center", valign: "middle" });
  t(s, [B("Lion", { fontSize: 18, breakLine: true }), R("Founder", { color: MUT, fontSize: 13 })], M + 1.2, Y0 + 0.32, hw - 1.5, 0.7);
  t(s, bullets(["First-year student, Computer Science (AI for Business, honours programme)",
    "Coursework in programming, databases, statistics, machine learning, marketing and entrepreneurship",
    "Works guiding foreign tourists in English: direct access to the people the product is for, and to on-the-ground checks of places",
    "Strong English; learning Chinese (HSK), a future second language for the product"], 13.5), M + 0.3, Y0 + 1.2, hw - 0.6, 2.45, { paraSpaceAfter: 5 });
  fillbox(s, M + 0.3, Y0 + 3.75, hw - 0.6, 0.65, [R("University name: "), F("[ ]"), R(" · Guiding since: "), F("[month/year]"), R(" · Contact / LinkedIn: "), F("[ ]")], 12);
  const x = M + hw + 0.3;
  card(s, x, Y0, hw, h, true);
  t(s, "How the work gets done", x + 0.3, Y0 + 0.3, hw - 0.6, 0.35, { fontSize: 17, bold: true });
  t(s, bullets(["Product and code built with AI-assisted development, reviewed by the founder", "Data verified by the founder from official pages and on tours", "Built in small, fixed weekly blocks alongside study"], 13.5),
    x + 0.3, Y0 + 0.75, hw - 0.6, 1.6, { paraSpaceAfter: 5 });
  t(s, "People we are looking for", x + 0.3, Y0 + 2.55, hw - 0.6, 0.35, { fontSize: 17, bold: true });
  fillbox(s, x + 0.3, Y0 + 3.0, hw - 0.6, 0.9, [R("Co-founder or advisors (e.g. hospitality, tourism, business development): "), F("[add names if any, or state \"seeking\"]")], 13);
}

// 11 FINANCIALS
{
  const s = content("Team, financials and plan", "10 · FINANCIALS", "Lean to run. Every figure below is an untested assumption, not a result.");
  const lw = 6.75, h = 4.35;
  card(s, M, Y0, lw, h); tag(s, "Base scenario · assumptions · VND, before tax", M + 0.25, Y0 + 0.2, true);
  const hd = (x) => ({ text: x, options: { bold: true, fontSize: 10, color: MUT } });
  const bo = (x, fill) => ({ text: x, options: Object.assign({ bold: true }, fill ? { fill: { color: THEME.colors.lt2 } } : {}) });
  const mu = (x) => ({ text: x, options: { color: MUT } });
  s.addTable([
    [hd(""), hd("2027"), hd("2028"), hd("2029")],
    ["Paying hotel / tour-operator partners (avg)", "1", "6", "15"],
    ["Labelled featured listings (avg)", "0", "8", "20"],
    ["Anonymised insight reports", "0", "1", "2"],
    [bo("Revenue"), bo("20M"), bo("181M"), bo("528M")],
    [bo("Costs"), bo("4.9M"), bo("79.5M"), bo("326.6M")],
    [bo("Operating result", 1), bo("15.1M", 1), bo("101.5M", 1), bo("201.4M", 1)],
    [mu("Revenue in USD (≈26,280 VND/USD)"), mu("~$0.8k"), mu("~$6.9k"), mu("~$20.1k")],
  ], { x: M + 0.25, y: Y0 + 0.6, w: lw - 0.5, colW: [3.35, 0.95, 0.95, lw - 0.5 - 5.25], fontSize: 12.5, fontFace: "Arial", color: THEME.colors.dk1,
    border: [{ type: "none" }, { type: "none" }, { type: "solid", pt: 0.75, color: LINE }, { type: "none" }], margin: [4, 6, 4, 6], rowH: 0.36, objectName: "financials-table" });
  t(s, "Low and High scenarios scale all volumes by 0.5× and 1.5×. Full model: saigon-in-a-day-financial-model.xlsx.", M + 0.25, Y0 + 3.75, lw - 0.5, 0.45, { fontSize: 10.5, color: MUT });
  const x = M + lw + 0.3, w = W - M - x;
  card(s, x, Y0, w, h); tag(s, "Assumed prices and costs", x + 0.25, Y0 + 0.2, true);
  t(s, bullets(["Travellers: free (a design decision)", "White-label: 1.5M VND/month (2.0M from 2029) + 2M setup fee per new partner",
    "Featured listing: 500k VND/month · insight report: 15M VND", "Founder unpaid in 2027; stipend 3M/month in 2028, 8M/month in 2029; part-time help from 2029",
    "AI cost is a placeholder (300 VND/plan); the planner also works with AI switched off"], 12.5), x + 0.25, Y0 + 0.6, w - 0.5, 2.6, { paraSpaceAfter: 4 });
  fillbox(s, x + 0.25, Y0 + 3.3, w - 0.5, 0.85, [B("Funding ask: "), F("[amount]"), R(" for "), F("[use]"), R(" over "), F("[months]"), R(". Leave out if not raising.")], 12.5);
  t(s, "Traction today: no users, partners, revenue or pilot. All prices and volumes will be validated in partner interviews and the hotel pilot. Exchange rate derived from SGGP, 31 Dec 2025.", M, 6.45, CW, 0.4, { fontSize: 10, color: MUT });
}

// 12 PLAN
{
  const s = content("Team, financials and plan", "11 · PLAN AND NEXT STEPS", "From prototype to a real pilot with visitors and hotels");
  const cw = (CW - 0.9) / 4;
  [["Nov 2026", "Data and rules", "Read HIST rules; verify places with coordinates and visit times; test official channels."],
   ["Dec 2026", "Small blocks", "Reach 8+ plannable places so real plans switch on. Limited time during exams."],
   ["After exams, early 2027", "Public MVP", "Deploy publicly; 12–20 verified plannable places; privacy page and disclaimer live."],
   ["After launch", "Pilot", "Survey real visitors (aim n ≥ 30); pilot with 3–5 hotels; report results with counts."]]
    .forEach(([tg, hd, p], i) => { const x = M + i * (cw + 0.3); card(s, x, Y0, cw, 2.2); tag(s, tg, x + 0.25, Y0 + 0.22);
      t(s, hd, x + 0.25, Y0 + 0.65, cw - 0.5, 0.35, { fontSize: 15, bold: true });
      t(s, p, x + 0.25, Y0 + 1.05, cw - 0.5, 1.1, { fontSize: 13 }); });
  const hw = (CW - 0.3) / 2, y = 4.45, h = 2.2;
  card(s, M, y, hw, h, true);
  t(s, "Targets we will report against", M + 0.3, y + 0.2, hw - 0.6, 0.35, { fontSize: 16, bold: true });
  t(s, bullets(["20, then 40 verified plannable places", "100% of plannable places re-checked within 90 days", "At least 70% of surveyed users rate the plan realistic"], 13.5), M + 0.3, y + 0.6, hw - 0.6, 1.1, { paraSpaceAfter: 3 });
  t(s, "Targets are proposals, not promises.", M + 0.3, y + 1.75, hw - 0.6, 0.3, { fontSize: 11, color: MUT });
  const x = M + hw + 0.3;
  card(s, x, y, hw, h);
  t(s, "What we ask from HIST 2026", x + 0.3, y + 0.2, hw - 0.6, 0.35, { fontSize: 16, bold: true });
  t(s, bullets(["Mentoring on B2B sales to hotels and tour operators", "Introductions to hotels and venues for the pilot", "Feedback from tourism experts on the data approach"], 13.5), x + 0.3, y + 0.6, hw - 0.6, 1.1, { paraSpaceAfter: 3 });
  t(s, [F("[Edit to match your real ask]"), R("  ·  Contact: "), F("[email]")], x + 0.3, y + 1.75, hw - 0.6, 0.3, { fontSize: 11, color: MUT });
}

(async () => { await pres.writeFile({ fileName: OUT }); await applyTheme(OUT, THEME); console.log("wrote", OUT); })();

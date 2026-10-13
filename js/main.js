/* Gen22 Fitness Center — site behaviour (no libraries) */
(function () {
  "use strict";
  var G = window.GYM || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.remove("no-js");

  function store(key, value) {
    try { var list = JSON.parse(localStorage.getItem(key) || "[]"); list.push(value); localStorage.setItem(key, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }
  function money(n) { return (G.currency ? G.currency + " " : "") + Number(n).toLocaleString(); }

  /* ---------- Config values ---------- */
  $$("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    if (k === "phone" && G.phone) { el.textContent = G.phone; el.href = "tel:" + G.phone.replace(/\s/g, ""); }
    else if (k === "email" && G.email) { el.textContent = G.email; el.href = "mailto:" + G.email; }
    else if (k === "address" && G.address) { el.textContent = G.address; }
    else if (k === "whatsapp" && G.whatsapp) { el.href = "https://wa.me/" + G.whatsapp + "?text=" + encodeURIComponent("Hi " + (G.name || "") + ", I'd like to know more about membership."); }
    else if (k.indexOf("social.") === 0 && G.social) { var url = G.social[k.slice(7)]; if (url) el.href = url; }
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Opening hours ---------- */
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function fmt(t) { var m = toMin(t), h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + (mm ? ":" + String(mm).padStart(2, "0") : "") + ap; }
  if (G.hours) {
    var now = new Date(), d = now.getDay(), cur = now.getHours() * 60 + now.getMinutes(), h = G.hours[d];
    var open = h && cur >= toMin(h.open) && cur < toMin(h.close);
    $$(".open-badge").forEach(function (el) {
      el.classList.add(open ? "is-open" : "is-closed");
      el.textContent = open ? "● Open now · until " + fmt(h.close) : "● Closed now" + (h && cur < toMin(h.open) ? " · opens " + fmt(h.open) : "");
    });
    $$("[data-hours]").forEach(function (ul) {
      ul.innerHTML = "";
      [1, 2, 3, 4, 5, 6, 0].forEach(function (i) {
        var x = G.hours[i], li = document.createElement("li");
        if (i === d) li.className = "today";
        li.innerHTML = "<span>" + x.day + "</span><span>" + (x.open ? fmt(x.open) + " – " + fmt(x.close) : "Closed") + "</span>";
        ul.appendChild(li);
      });
    });
  }

  /* ---------- Map ---------- */
  var map = $("iframe.map");
  if (map && G.mapQuery) map.src = "https://www.google.com/maps?q=" + encodeURIComponent(G.mapQuery) + "&output=embed";

  /* ---------- Mobile menu ---------- */
  var toggle = $(".menu-toggle"), links = $("#nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var o = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", o);
      toggle.setAttribute("aria-label", o ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && links.classList.contains("open")) { toggle.click(); toggle.focus(); } });
  }

  /* ---------- Back to top ---------- */
  var top = $(".to-top");
  if (top) {
    window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 600); }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
  }

  /* ---------- Reveal + counters ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function count(el) {
    var target = +el.getAttribute("data-count"), suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target.toLocaleString() + suffix; return; }
    var t0 = null;
    (function step(ts) { t0 = t0 || ts; var p = Math.min((ts - t0) / 1400, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix; if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        if (en.target.hasAttribute("data-count")) count(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: .15 });
    $$(".reveal, [data-count]").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
    $$("[data-count]").forEach(count);
  }

  /* ---------- Pricing toggle ---------- */
  function renderPrices(mode) {
    $$("[data-monthly]").forEach(function (el) {
      var m = +el.getAttribute("data-monthly"), annual = Math.round(m * 12 * 0.8);
      var amt = $(".amt", el), per = $(".per", el), note = el.parentNode.querySelector(".price-note");
      if (mode === "annual") { amt.textContent = money(Math.round(annual / 12)); per.textContent = "/mo"; if (note) note.textContent = "Billed " + money(annual) + " yearly · save " + money(m * 12 - annual); }
      else { amt.textContent = money(m); per.textContent = "/mo"; if (note) note.textContent = "Billed monthly · cancel anytime"; }
    });
    $$("[data-price]").forEach(function (el) { el.textContent = money(el.getAttribute("data-price")); });
  }
  var billing = $(".billing");
  if (billing) {
    $$("button", billing).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", billing).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        renderPrices(b.getAttribute("data-mode"));
      });
    });
  }
  renderPrices("monthly");

  /* ---------- Schedule filter ---------- */
  var tt = $(".timetable");
  if (tt) {
    var today = new Date().getDay(); // 0 Sun
    var dayEls = $$(".day", tt);
    dayEls.forEach(function (el) { if (+el.getAttribute("data-day") === today) el.classList.add("today", "show"); });
    $$(".filters .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        $$(".filters .chip").forEach(function (c) { c.setAttribute("aria-pressed", c === chip); });
        var cat = chip.getAttribute("data-filter");
        $$(".slot", tt).forEach(function (s) { s.hidden = cat !== "all" && s.getAttribute("data-cat") !== cat; });
      });
    });
    var tabs = $(".day-tabs");
    if (tabs) {
      $$(".chip", tabs).forEach(function (c) {
        if (+c.getAttribute("data-day") === today) c.setAttribute("aria-pressed", "true");
        c.addEventListener("click", function () {
          $$(".chip", tabs).forEach(function (x) { x.setAttribute("aria-pressed", x === c); });
          dayEls.forEach(function (el) { el.classList.toggle("show", el.getAttribute("data-day") === c.getAttribute("data-day")); });
        });
      });
    }
  }

  /* ---------- BMI calculator ---------- */
  var bmi = $("#bmi-form");
  if (bmi) {
    bmi.addEventListener("submit", function (e) {
      e.preventDefault();
      var w = parseFloat(bmi.weight.value), hcm = parseFloat(bmi.height.value), out = $("#bmi-result");
      if (!(w > 20 && w < 400) || !(hcm > 100 && hcm < 250)) { out.innerHTML = "Please enter a weight (kg) and height (cm) in a realistic range."; return; }
      var v = w / Math.pow(hcm / 100, 2), cat, tip;
      if (v < 18.5) { cat = "Underweight"; tip = "Our Strength & Build program and a nutrition consult can help you add healthy muscle."; }
      else if (v < 25) { cat = "Healthy range"; tip = "Keep it up! Try HIIT or Strength classes to level up performance."; }
      else if (v < 30) { cat = "Overweight"; tip = "Mix HIIT, Spin and a personal-training plan for steady, sustainable progress."; }
      else { cat = "Obese range"; tip = "Start with low-impact classes and a coach-led plan. Book a free consultation."; }
      out.innerHTML = "Your BMI: <strong>" + v.toFixed(1) + "</strong> · " + cat + "<br><span class='muted'>" + tip + " BMI is a rough guide and doesn't account for muscle mass.</span>";
    });
  }

  /* ---------- Forms (demo: stored in this browser) ---------- */
  function validate(form) {
    var ok = true;
    $$("[required], [data-phone], [type=email]", form).forEach(function (f) {
      var err = "", v = f.value.trim();
      if (f.hasAttribute("required") && !v) err = "This field is required.";
      else if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) err = "Enter a valid email address.";
      else if (f.hasAttribute("data-phone") && v && !/^\+?[\d\s()-]{9,16}$/.test(v)) err = "Enter a valid phone number.";
      f.classList.toggle("invalid", !!err);
      f.setAttribute("aria-invalid", !!err);
      var box = f.parentNode.querySelector(".field-error");
      if (box) box.textContent = err;
      if (err && ok) { ok = false; f.focus(); }
    });
    return ok;
  }
  $$("form[data-demo]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; }); data.at = new Date().toISOString();
      store("gen22-" + form.getAttribute("data-demo"), data);
      var status = $(".form-status", form) || form.nextElementSibling;
      if (status) { status.textContent = form.getAttribute("data-success") || "Thanks! We'll be in touch soon."; status.classList.add("show"); }
      form.reset();
    });
  });

  /* Pre-select plan from ?plan= on the contact page */
  var planSel = $("#trial-plan"), qp = new URLSearchParams(location.search).get("plan");
  if (planSel && qp) $$("option", planSel).forEach(function (o) { if (o.value === qp) o.selected = true; });
})();

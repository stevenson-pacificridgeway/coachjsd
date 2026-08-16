/* Coach J. San Diego — Book-a-Call lead capture → Supabase */
(function () {
  "use strict";
  var URL = "https://xcobjwpmrqvtfagdphao.supabase.co";
  var KEY = "sb_publishable_ZxgTmxueol1DuvUaZTYsKQ_j7xrFR5n";
  var sb = window.supabase ? window.supabase.createClient(URL, KEY) : null;

  var modal = document.createElement("div");
  modal.className = "bk-overlay";
  modal.innerHTML =
    '<div class="bk-modal">' +
    '<button class="bk-close" aria-label="Close">&times;</button>' +
    '<div class="bk-panel">' +
    '<h3>Book your free consultation</h3>' +
    '<p class="bk-sub">Tell Coach J. a bit about your goals — he\'ll reach out personally.</p>' +
    '<form class="bk-form" novalidate>' +
    '<input name="name" placeholder="Your name" required>' +
    '<input name="email" type="email" placeholder="Email" required>' +
    '<input name="phone" type="tel" placeholder="Phone (optional)">' +
    '<select name="goal"><option value="">Your main goal…</option><option>Fat loss</option><option>Build muscle</option><option>General fitness</option><option>Athletic performance</option></select>' +
    '<select name="tier"><option value="">Interested in…</option><option>Remote Coaching ($250/mo)</option><option>In-Person 2x/week ($500/mo)</option><option>In-Person 3x/week ($1,000/mo)</option><option>Not sure yet</option></select>' +
    '<textarea name="message" placeholder="Anything else? (optional)" rows="3"></textarea>' +
    '<button type="submit" class="btn btn-primary btn-lg bk-submit">Request my consultation</button>' +
    '</form></div>' +
    '<div class="bk-success" hidden><div class="bk-check">✓</div><h3>You\'re in!</h3><p class="bk-sub">Coach J. will reach out shortly. Talk soon! 💪</p></div>' +
    "</div>";
  document.body.appendChild(modal);

  var panel = modal.querySelector(".bk-panel");
  var success = modal.querySelector(".bk-success");
  var form = modal.querySelector(".bk-form");

  function open(e) { if (e) e.preventDefault(); modal.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { modal.classList.remove("open"); document.body.style.overflow = ""; }
  modal.querySelector(".bk-close").onclick = close;
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  // Hijack every "Book / Consultation / Get started" link to open the modal
  document.querySelectorAll("a").forEach(function (a) {
    var t = (a.textContent || "").toLowerCase();
    var href = (a.getAttribute("href") || "");
    var isBook = /book|consult|get started/.test(t) || href.indexOf("#book") !== -1;
    if (isBook) a.addEventListener("click", open);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = modal.querySelector(".bk-submit");
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (!data.name || !data.email) { btn.textContent = "Please add your name & email"; return; }
    btn.textContent = "Sending…"; btn.disabled = true;
    // Email a copy of every request to Coach J. (fire-and-forget)
    try {
      fetch("https://formsubmit.co/ajax/coachjsd@yahoo.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "New consultation request — Coach J. San Diego",
          name: data.name, email: data.email, phone: data.phone || "",
          goal: data.goal || "", tier: data.tier || "", message: data.message || ""
        })
      }).catch(function () {});
    } catch (e) {}
    var done = function () { panel.hidden = true; success.hidden = false; };
    if (sb) {
      sb.from("bookings").insert(data).then(function (r) {
        if (r.error) { btn.textContent = "Try again"; btn.disabled = false; alert("Sorry — " + r.error.message); }
        else done();
      });
    } else { done(); }
  });
})();

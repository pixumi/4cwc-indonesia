/*
 * Site-wide behaviour, served as a first-party file so the Content-Security-
 * Policy can stay at `script-src 'self'` (no 'unsafe-inline'). Every block
 * guards on the elements it needs, so the same file is safe on every page.
 */
(function () {
  "use strict";

  /* ---- Sticky header: hide going down, reveal going up ------------------ */
  var nav = document.getElementById("site-nav");
  if (nav) {
    var last = window.scrollY;
    var ticking = false;
    var THRESHOLD = 6; // ignore sub-pixel jitter and rubber-banding

    var update = function () {
      var y = Math.max(0, window.scrollY);
      var delta = y - last;
      nav.dataset.scrolled = y > 4 ? "true" : "false";
      if (Math.abs(delta) > THRESHOLD) {
        // Never hide near the very top, or the page opens headerless.
        nav.dataset.hidden = delta > 0 && y > nav.offsetHeight ? "true" : "false";
        last = y;
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---- Player art: fall back to the initial when an image fails --------- */
  var art = document.querySelectorAll(".pcard-avatar img, .pcard-cover");
  Array.prototype.forEach.call(art, function (img) {
    if (img.complete && img.naturalWidth === 0) {
      img.remove();
    } else {
      img.addEventListener("error", function () { img.remove(); }, { once: true });
    }
  });

  /* ---- Season filter ---------------------------------------------------- */
  var bar = document.getElementById("year-filter");
  var sections = Array.prototype.slice.call(document.querySelectorAll("section.season"));
  if (bar && sections.length) {
    var pills = Array.prototype.slice.call(bar.querySelectorAll(".pill"));

    var apply = function (year) {
      sections.forEach(function (el) {
        el.hidden = year !== "all" && el.dataset.year !== year;
      });
      pills.forEach(function (b) {
        b.classList.toggle("active", b.dataset.year === year);
      });
      var url = new URL(window.location.href);
      if (year === "all") url.searchParams.delete("year");
      else url.searchParams.set("year", year);
      history.replaceState(null, "", url.pathname + url.search);
    };

    bar.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest(".pill") : null;
      if (btn && btn.dataset.year) apply(btn.dataset.year);
    });

    // Honour ?year= on load so a filtered view can be linked to.
    var initial = new URL(window.location.href).searchParams.get("year");
    if (initial && sections.some(function (s) { return s.dataset.year === initial; })) apply(initial);
  }
})();

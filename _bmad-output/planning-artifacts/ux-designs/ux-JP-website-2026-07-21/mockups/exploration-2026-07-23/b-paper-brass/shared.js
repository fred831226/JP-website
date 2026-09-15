/* Direction B — Paper & Brass 共用互動
   導覽下拉（點擊展開、Esc/外部點擊關閉）、手機選單、進場動態。
   行為比照 EXPERIENCE.md：桌機不以 hover 展開選單。 */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 桌機下拉：點擊展開，互斥；Esc / 外部點擊關閉並把焦點還給觸發器 ---- */
  var navItems = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  function closeAll(except) {
    navItems.forEach(function (d) {
      if (d !== except) d.removeAttribute("open");
    });
  }
  navItems.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) closeAll(d);
    });
  });
  document.addEventListener("click", function (e) {
    navItems.forEach(function (d) {
      if (d.open && !d.contains(e.target)) d.removeAttribute("open");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = navItems.find(function (d) { return d.open; });
    if (open) {
      open.removeAttribute("open");
      var summary = open.querySelector("summary");
      if (summary) summary.focus();
    }
  });

  /* ---- 手機選單 ---- */
  var menuBtn = document.querySelector(".menu-btn");
  var mobileNav = document.getElementById("mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.textContent = open ? "關閉" : "選單";
    });
  }

  /* ---- 進場動態：JS 啟用才隱藏，無 JS / 減少動態時直接可見 ---- */
  var rvEls = Array.prototype.slice.call(document.querySelectorAll(".rv, .hairline"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    rvEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rvEls.forEach(function (el) { io.observe(el); });
  }
})();

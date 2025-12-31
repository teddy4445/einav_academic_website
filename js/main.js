// /js/main.js
// Inject header + footer on every page (safe, async, no shared XHR)

let thisPage = location.href.split("/").slice(-1)[0];
if (thisPage === "") thisPage = "index";

document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();

  activeMenuLink();
  manageCollapsible();
  bindAlertClose();
  bindMobileMenu();
});

/* ---------------- HEADER / FOOTER ---------------- */

async function loadHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  try {
    const res = await fetch("/components/header.html", { cache: "no-store" });
    if (!res.ok) throw new Error(`Header HTTP ${res.status}`);
    header.innerHTML = await res.text();
  } catch (e) {
    console.error("Failed to load header:", e);
  }
}

async function loadFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  try {
    const res = await fetch("/components/footer.html", { cache: "no-store" });
    if (!res.ok) throw new Error(`Footer HTTP ${res.status}`);
    footer.innerHTML = await res.text();

    // ✅ Set year AFTER footer HTML is injected
    const yearEl = document.querySelector(".footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (e) {
    console.error("Failed to load footer:", e);
  }
}

/* ---------------- MENU ---------------- */

function activeMenuLink() {
  if (typeof $ === "undefined") return;

  $(".menu a").each(function () {
    if ($(this).attr("id") === thisPage) {
      $(this).addClass("active");
    }
  });
}

/* ---------------- COLLAPSIBLE ---------------- */

function manageCollapsible() {
  const coll = document.getElementsByClassName("collapsible");

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      for (let j = 0; j < coll.length; j++) {
        if (this === coll[j]) continue;

        if (coll[j].classList.contains("active")) {
          coll[j].classList.remove("active");
          const content = $(coll[j]).find("div")[0];
          if (content) {
            content.style.maxHeight = null;
            content.style.opacity = null;
          }
        }
      }

      this.classList.toggle("active");
      const content = $(this).find("div")[0];
      if (!content) return;

      content.style.maxHeight = content.style.maxHeight
        ? null
        : content.scrollHeight + "px";

      content.style.opacity = content.style.opacity ? null : 1;
    });
  }
}

/* ---------------- ALERTS ---------------- */

function bindAlertClose() {
  const btn = document.getElementById("alert-close-btn");
  if (!btn) return;

  btn.onclick = function () {
    const div = this.parentElement;
    if (div) div.style.opacity = "0";
  };
}

/* ---------------- MOBILE MENU ---------------- */

function bindMobileMenu() {
  const bg = document.getElementById("mobile-menu-bg");
  const menu = document.getElementById("mobile-menu");

  if (bg && menu) {
    bg.onclick = function () {
      menu.style.marginLeft = "-320px";
      bg.style.marginLeft = "100%";
    };

    menu.onclick = function (e) {
      e.stopPropagation();
    };
  }
}

/* ---------------- UTILITIES ---------------- */

function gotoIndex() {
  const width = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );

  if (width > 850) {
    window.location.replace("/");
  }
}

function copy_cite(input_holder_id) {
  const input = document.getElementById(input_holder_id);
  if (!input) return;

  const copyText = input.value;
  navigator.clipboard.writeText(copyText);

  const alertBtn = document.getElementById("alert-close-btn");
  if (!alertBtn) return;

  const alertDiv = alertBtn.parentElement;
  const alertText = document.getElementById("cite-alert");

  if (alertText) alertText.innerHTML = "Copied: " + copyText;

  if (alertDiv) {
    alertDiv.style.opacity = "1";
    alertDiv.style.zIndex = "999999";

    setTimeout(() => {
      alertDiv.style.opacity = "0";
      alertDiv.style.zIndex = "-999999";
    }, 2500);
  }
}

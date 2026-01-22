// /js/main.js
// Inject header + footer on every page (safe, async)

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadHeader();
    await loadFooter();

    // After header/footer are injected:
    activeMenuLink();
    manageCollapsible();
    bindAlertClose();
    bindMobileMenu();
  } catch (e) {
    console.error("main.js failed:", e);
  }
});

/* ---------------- HELPERS ---------------- */

async function fetchFirstOk(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return { url, html: await res.text() };
      console.warn(`Fetch failed (${res.status}) for:`, url);
    } catch (e) {
      console.warn("Fetch error for:", url, e);
    }
  }
  throw new Error("All fetch attempts failed: " + urls.join(" OR "));
}

/* ---------------- HEADER / FOOTER ---------------- */

async function loadHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const { html } = await fetchFirstOk([
    "/components/header.html",
    "components/header.html",
    "./components/header.html",
  ]);

  header.innerHTML = html;
}

async function loadFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  const { html } = await fetchFirstOk([
    "/components/footer.html",
    "components/footer.html",
    "./components/footer.html",
  ]);

  footer.innerHTML = html;

  // Set year AFTER footer HTML is injected
  const yearEl = document.querySelector(".footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------- ACTIVE MENU LINK ---------------- */

function activeMenuLink() {
  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  const markActive = (selector) => {
    document.querySelectorAll(selector).forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;

      const cleanHref = href.split("?")[0].split("#")[0].toLowerCase();

      const isHome =
        page === "index.html" &&
        (cleanHref === "/" || cleanHref.endsWith("/index.html") || cleanHref === "index.html");

      const isMatch = cleanHref.endsWith("/" + page) || cleanHref === page;

      if (isHome || isMatch) a.classList.add("active");
    });
  };

  markActive("nav a[href]");
  markActive("#mobile-menu a[href]");
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
          const otherContent = coll[j].querySelector("div");
          if (otherContent) {
            otherContent.style.maxHeight = null;
            otherContent.style.opacity = null;
          }
        }
      }

      this.classList.toggle("active");
      const content = this.querySelector("div");
      if (!content) return;

      content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
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

  if (width > 850) window.location.replace("/");
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

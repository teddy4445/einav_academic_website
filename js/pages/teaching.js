// /js/pages/teaching.js
// Clean + robust teaching page renderer (no dependency on older components)

const TEACHING_JSON = "/data/jsons/teaching.json";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await fetchJson(TEACHING_JSON);
    const courses = Array.isArray(data?.courses) ? data.courses : [];

    // Cache DOM
    const topicSel = document.getElementById("topic-filter");
    const yearSel = document.getElementById("year-filter");
    const uniSel = document.getElementById("university-filter");
    const body = document.getElementById("teaching-body");
    const resetBtn = document.getElementById("reset-btn");

    if (!topicSel || !yearSel || !uniSel || !body) return;

    // Build filter values
    const topics = uniqueSorted(courses.map((c) => c?.topic).filter(Boolean));
    const years = uniqueSorted(courses.map((c) => c?.year).filter(Boolean), true);
    const unis = uniqueSorted(courses.map((c) => c?.university).filter(Boolean));

    fillSelect(topicSel, "Topic", topics);
    fillSelect(yearSel, "Year", years);
    fillSelect(uniSel, "Institution", unis);

    // Initial render
    renderCourses(body, courses);

    // Filtering
    const applyFilters = () => {
      const t = normalizedSelectValue(topicSel, "Topic");
      const y = normalizedSelectValue(yearSel, "Year");
      const u = normalizedSelectValue(uniSel, "Institution");

      const filtered = courses.filter((c) => {
        const okT = !t || (c?.topic || "") === t;
        const okY = !y || (c?.year || "") === y;
        const okU = !u || (c?.university || "") === u;
        return okT && okY && okU;
      });

      renderCourses(body, filtered);
    };

    topicSel.addEventListener("change", applyFilters);
    yearSel.addEventListener("change", applyFilters);
    uniSel.addEventListener("change", applyFilters);

    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        topicSel.selectedIndex = 0;
        yearSel.selectedIndex = 0;
        uniSel.selectedIndex = 0;
        renderCourses(body, courses);
      });
    }
  } catch (err) {
    console.error("Teaching page failed:", err);
  }
});

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return await res.json();
}

function uniqueSorted(arr, numeric = false) {
  const uniq = Array.from(new Set(arr.map(String)));
  if (numeric) return uniq.sort((a, b) => Number(b) - Number(a)); // newest first
  return uniq.sort((a, b) => a.localeCompare(b));
}

function fillSelect(select, placeholder, values) {
  // keep first option as placeholder
  select.innerHTML = `<option>${placeholder}</option>`;
  values.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

function normalizedSelectValue(select, placeholder) {
  const v = (select.value || "").trim();
  if (!v || v === placeholder) return "";
  return v;
}

function renderCourses(container, courses) {
  if (!Array.isArray(courses) || courses.length === 0) {
    container.innerHTML = `<p class="content-text" style="max-width:80ch;">No courses found for the selected filters.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="cards">
      ${courses.map(courseCardHtml).join("")}
    </div>
  `;
}

function courseCardHtml(c) {
  const code = c?.code || "";
  const name = c?.name || "Untitled course";
  const year = c?.year ? `<span class="small">${escapeHtml(c.year)}</span>` : "";
  const topic = c?.topic ? `<span class="small">${escapeHtml(c.topic)}</span>` : "";
  const uni = c?.university ? `<span class="small">${escapeHtml(c.university)}</span>` : "";
  const loc = c?.location_class ? `<span class="small">${escapeHtml(c.location_class)}</span>` : "";
  const desc =
  c?.description &&
  c.description.trim().toLowerCase() !== "only placeholder."
    ? escapeHtml(c.description)
    : "";

  const meta = [year, topic, uni, loc].filter(Boolean).join(" · ");

  return `
    <article class="card">
      <h3 style="margin-bottom:.35rem;">
        <a href="/course-page.html?course_id=${encodeURIComponent(code)}" style="text-decoration:none;">
          ${escapeHtml(name)}
        </a>
      </h3>
      <p class="small" style="margin:0 0 .5rem 0; opacity:.85;">${meta}</p>
      ${desc ? `<p style="margin:0; max-width:90ch;">${desc}</p>` : ""}
      <p style="margin-top:.75rem;">
        <a class="btn btn--ghost" href="/course-page.html?course_id=${encodeURIComponent(code)}">
          Open course page
        </a>
      </p>
    </article>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

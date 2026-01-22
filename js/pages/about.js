// /js/pages/about.js

import { Icons } from "/js/components/icons.js";
import { Tabs } from "/js/components/tabs.js";
import { ProjectSection } from "/js/components/projectSection.js";
import { Resource } from "/js/components/resources.js";
import { addCollapseFunction } from "/js/descriptionSlicer.js";

// Data file paths
const LECTURER_INFO_JSON = "/data/jsons/lecturer.json";
const INDEX_JSON = "/data/jsons/index.json";
const RESOURCES_JSON = "/data/jsons/resources.json";
const SECTIONS = ["Biography", "Personal-projects", "Recommended-resources"];
const ALL_TOPIC_KEY = "all";

/* ---------- helpers ---------- */

async function fetchJson(path, fallback = {}) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return fallback;
    return await res.json();
  } catch (e) {
    console.error("fetchJson failed:", path, e);
    return fallback;
  }
}

function $(id) {
  return document.getElementById(id);
}

/*
  About page builder
*/
class About {
  constructor() {
    this.section_open = SECTIONS[0];

    try {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("section");
      if (s) this.section_open = s;
    } catch {
      this.section_open = SECTIONS[0];
    }

    this.resourcesObj = { resources: [] };
  }

  async build() {
    // Load all data (async, reliable)
    const [indexObj, lecturerObj, resourcesObj] = await Promise.all([
      fetchJson(INDEX_JSON, {}),
      fetchJson(LECTURER_INFO_JSON, {}),
      fetchJson(RESOURCES_JSON, { resources: [] }),
    ]);

    this.resourcesObj = resourcesObj || { resources: [] };

    // Build sections
    this.buildBiography(indexObj);
    this.buildProjects(indexObj);
    this.buildResources(false, "buildFilters");

    // Tabs
    this.createTabsSection();
    this.pickTab();

    // Header info + contacts + locations
    this.buildInfo(lecturerObj);

    // collapse handlers
    addCollapseFunction();
  }

  createTabsSection() {
    Tabs.createTabsSection();
    Tabs.addTab("Biography", "Bio");
    Tabs.addTab("Personal projects", "Projects");
    Tabs.addTab("Recommended resources", "Resources", true);
  }

  pickTab() {
    for (let i = 0; i < SECTIONS.length; i++) {
      if (this.section_open === SECTIONS[i]) {
        Tabs.activateDefault(i);
        return;
      }
    }
    Tabs.activateDefault(0);
  }

  buildInfo(lecturerObj) {
    const setHTML = (id, html) => {
      const el = $(id);
      if (el) el.innerHTML = html ?? "";
    };

    setHTML("lecturer_name", lecturerObj?.name || "");
    setHTML("lecturer_position", lecturerObj?.position || "");
    setHTML("info-icon", Icons.info ? Icons.info() : "");

    this.buildContact(lecturerObj);

    const addresses = Array.isArray(lecturerObj?.addresses) ? lecturerObj.addresses : [];
    if (addresses.length) {
      this.buildLocations(addresses);
    } else {
      const loc = $("lecturer_location");
      if (loc) loc.style.display = "none";
    }

    this.buildMobileHeaderInfo(addresses);
  }

  buildMobileHeaderInfo(addresses) {
    const el = $("lecturer_location_mobile");
    if (!el) return;

    let str = "";
    for (let i = 0; i < addresses.length; i++) {
      str +=
        `<div class="organization">${addresses[i]?.university || ""}</div>` +
        `<div>${addresses[i]?.location || ""}</div>` +
        `<div>${addresses[i]?.hours || ""}</div>`;
      if (i + 1 < addresses.length) str += "<br>";
    }
    el.innerHTML = str;
  }

  buildBiography(indexObj) {
    const el = $("bio_text");
    if (!el) return;
    el.innerHTML = indexObj?.biography || "";
  }

  buildProjects(indexObj, topic, change = false) {
    const projects = Array.isArray(indexObj?.currentProjects) ? indexObj.currentProjects : [];

    if (!change) {
      const topics = this.buildTopicNav(projects);
      if (topics && topics.length > 0) {
        const topicsList = $("topics_list");
        if (topicsList && topicsList.firstChild) topicsList.firstChild.classList.add("active-topic");
        this.dynamicBuildProjects(projects, topics[0]);
      } else {
        const projectsList = ProjectSection.createListFromJson(projects);
        let panels = "";
        for (let i = 0; i < projectsList.length; i++) {
          panels += `<div class="projects-panel">${projectsList[i].toHtml()}</div>`;
          if (i + 1 < projectsList.length) panels += "<hr>";
        }
        const cards = $("projects_cards");
        if (cards) cards.innerHTML = panels;
      }
    } else {
      this.dynamicBuildProjects(projects, topic);
      addCollapseFunction();
    }
  }

  dynamicBuildProjects(projects, topic) {
    const filtered = ProjectSection.filterList(projects, "topic", topic);
    const projectsList = ProjectSection.createListFromJson(filtered);

    let panels = "";
    for (let i = 0; i < projectsList.length; i++) {
      panels += `<div class="projects-panel">${projectsList[i].toHtml()}</div>`;
    }

    const cards = $("projects_cards");
    if (cards) cards.innerHTML = panels;
  }

  buildTopicNav(projects) {
    const topics = new Set([ALL_TOPIC_KEY]);

    for (let i = 0; i < projects.length; i++) {
      if (projects[i]?.topic) topics.add(projects[i].topic);
    }

    if (topics.size < 3) {
      const t = $("topics");
      if (t) t.style.display = "none";
      return null;
    }

    const topics_list = $("topics_list");
    if (!topics_list) return null;

    topics_list.innerHTML = "";

    const topicArr = Array.from(topics);

    for (let i = 0; i < topicArr.length; i++) {
      const li = document.createElement("LI");
      li.classList.add("topic");
      li.textContent = topicArr[i];

      li.addEventListener("click", () => {
        const allTopics = document.getElementsByClassName("topic");
        for (let j = 0; j < allTopics.length; j++) allTopics[j].classList.remove("active-topic");
        li.classList.add("active-topic");
        this.buildProjects({ currentProjects: projects }, topicArr[i], true);
      });

      topics_list.appendChild(li);
    }

    return topicArr;
  }

  buildContact(lecturerObj) {
    const cv = lecturerObj?.cvfile || "";
    const email = lecturerObj?.email || "";
    const phone = lecturerObj?.phone || "";
    const linkedin = lecturerObj?.linkedin_link || "";
    const google = lecturerObj?.google_scholar_link || "";
    const orcid = lecturerObj?.orcid_link || "";
    const facebook = lecturerObj?.facebook_link || "";

    const contacts = $("contacts");
    const mobileContacts = $("contacts-mobile");
    if (!contacts || !mobileContacts) return;

    contacts.innerHTML = "";
    mobileContacts.innerHTML = "";

    if (cv) {
      const a1 = document.createElement("A");
      a1.href = cv;
      a1.id = "cv";
      a1.innerHTML = (Icons.cv ? Icons.cv() : "") + '<span style="margin-left: 5px;">Download CV</span>';
      contacts.appendChild(a1);

      const a2 = document.createElement("A");
      a2.href = cv;
      a2.innerHTML = Icons.cv ? Icons.cv() : "";
      a2.classList.add("social-icon");
      mobileContacts.appendChild(a2);
    }

    if (email) {
      const p = document.createElement("P");
      p.innerHTML = (Icons.mail ? Icons.mail() : "") + " " + email;
      contacts.appendChild(p);

      const a = document.createElement("A");
      a.innerHTML = Icons.mail_mobile ? Icons.mail_mobile() : (Icons.mail ? Icons.mail() : "");
      a.href = "mailto:" + email;
      a.classList.add("social-icon");
      mobileContacts.appendChild(a);
    }

    if (phone) {
      const p = document.createElement("P");
      p.innerHTML = (Icons.phone ? Icons.phone() : "") + " " + phone;
      contacts.appendChild(p);

      const a = document.createElement("A");
      a.innerHTML = Icons.phone ? Icons.phone() : "";
      a.href = "tel:" + phone;
      a.classList.add("social-icon");
      mobileContacts.appendChild(a);
    }

    const addIconPair = (html, href) => {
      if (!href || !html) return;

      const icon1 = document.createElement("A");
      icon1.innerHTML = html;
      icon1.classList.add("social-icon");
      icon1.href = href;
      icon1.target = "_blank";
      icon1.rel = "noopener noreferrer";
      contacts.appendChild(icon1);

      const icon2 = document.createElement("A");
      icon2.innerHTML = html;
      icon2.classList.add("social-icon");
      icon2.href = href;
      icon2.target = "_blank";
      icon2.rel = "noopener noreferrer";
      mobileContacts.appendChild(icon2);
    };

    addIconPair(Icons.linkedin ? Icons.linkedin() : "", linkedin);
    addIconPair(Icons.google ? Icons.google() : "", google);
    addIconPair(Icons.orcid ? Icons.orcid() : "", orcid);
    addIconPair(Icons.about_facebook ? Icons.about_facebook() : "", facebook);
  }

  buildLocations(addresses) {
    const org = $("organization");
    const room = $("room");
    const hours = $("hours");
    const info_table = $("info-table");
    if (!org || !room || !hours || !info_table) return;

    org.innerHTML = (Icons.buildings ? Icons.buildings() : "") + "<div class='after-icon-cell'> Organization </div>";
    room.innerHTML = (Icons.location ? Icons.location() : "") + "<div class='after-icon-cell'> Office </div>";
    hours.innerHTML = (Icons.clock ? Icons.clock() : "") + "<div class='after-icon-cell'> Open door hours </div>";

    while (info_table.rows.length > 1) info_table.deleteRow(1);

    for (let i = 0; i < addresses.length; i++) {
      const row = info_table.insertRow(-1);
      row.insertCell(0).innerHTML = addresses[i]?.university || "";
      row.insertCell(1).innerHTML = addresses[i]?.location || "";
      row.insertCell(2).innerHTML = addresses[i]?.hours || "";
    }
  }

  buildFilters(rawResources) {
    this.buildOneFilter(rawResources, "year");
    this.buildOneFilter(rawResources, "type");
    this.buildOneFilter(rawResources, "topic");
  }

  buildOneFilter(rawResources, fName) {
    const normalized = new Set();

    for (let i = 0; i < rawResources.length; i++) {
      let v = rawResources[i]?.[fName];
      if (v == null) continue;

      v = v.toString().trim();
      if (!v) continue;

      normalized.add(v.toLowerCase());
    }

    const values = Array.from(normalized);
    const select = $(fName + "-filter");
    if (!select) return;

    while (select.options.length > 1) select.remove(1);

    if (values.length > 1) {
      for (let i = 0; i < values.length; i++) {
        const opt = document.createElement("OPTION");
        opt.textContent = values[i];
        select.appendChild(opt);
      }

      const filter_btn = $("filter-btn");
      if (filter_btn) filter_btn.innerHTML = (Icons.filter ? Icons.filter() : "") + " Filter";
    } else {
      select.style.display = "none";
    }
  }

  buildResources(change = false, filterName) {
    this.clearResources();

    const res_section = $("resources_section");
    if (!res_section) return;

    const raw = Array.isArray(this.resourcesObj?.resources) ? this.resourcesObj.resources : [];

    if (filterName === "buildFilters") {
      res_section.style.display = "";
      this.buildFilters(raw);
    }

    if (!raw || raw.length === 0) {
      const filtersEl = $("resources_filters");
      if (filtersEl) filtersEl.style.display = "none";

      const filterBy = $("filter_by");
      if (filterBy) filterBy.innerHTML = "No resources to show.";

      const filter_btn = $("filter-btn");
      if (filter_btn) filter_btn.innerHTML = "No resources to show.";
      return;
    }

    let filteredRaw = raw;

    if (change) {
      const selector = $(filterName + "-filter");
      if (!selector) return;

      const selectedIndex = selector.selectedIndex;
      const selected = (selector.options[selectedIndex]?.value || "").trim().toLowerCase();

      selector.classList.add("active-sort-button");

      filteredRaw = raw.filter((r) => {
        const v = (r?.[filterName] ?? "").toString().trim().toLowerCase();
        return v === selected;
      });

      const reset = $("reset-btn");
      if (reset) reset.innerHTML = (Icons.reset ? Icons.reset() : "") + " Reset";
    }

    const resourcesList = Resource.createListFromJson(filteredRaw);

    const frag = document.createDocumentFragment();
    for (let i = 0; i < resourcesList.length; i++) {
      const wrap = document.createElement("div");
      wrap.innerHTML = resourcesList[i].toHtml();
      while (wrap.firstChild) frag.appendChild(wrap.firstChild);
    }
    res_section.appendChild(frag);

    if (change) addCollapseFunction();
  }

  clearResources() {
    const res_section = $("resources_section");
    if (res_section) res_section.innerHTML = "";
  }

  clearFiltersDesign() {
    const selects = document.getElementsByClassName("active-sort-button");
    const resetBtn = $("reset-btn");
    if (resetBtn) resetBtn.style.display = "none";

    for (let i = selects.length - 1; i >= 0; i--) {
      selects[i].selectedIndex = 0;
      selects[i].classList.remove("active-sort-button");
    }
  }

  filtersDisplay() {
    if (window.innerWidth > 430) return;

    const filters = document.getElementsByClassName("resources-filters")[0];
    if (!filters) return;

    const current = filters.style.display;
    filters.style.display = (current === "none" || current === "") ? "block" : "none";
  }
}

/* ---------- init + events ---------- */

const aboutPage = new About();

document.addEventListener("DOMContentLoaded", async () => {
  await aboutPage.build();

  const resetBtn = $("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      aboutPage.clearFiltersDesign();
      aboutPage.buildResources();
    });
  }

  const filterBtn = $("filter-btn");
  if (filterBtn) filterBtn.addEventListener("click", () => aboutPage.filtersDisplay());

  const wireFilter = (name) => {
    const el = $(name + "-filter");
    if (!el) return;
    el.addEventListener("change", () => {
      if (el.selectedIndex !== 0) {
        aboutPage.clearFiltersDesign();
        const r = $("reset-btn");
        if (r) r.style.display = "";
        aboutPage.buildResources(true, name);
      }
    });
  };

  wireFilter("year");
  wireFilter("type");
  wireFilter("topic");
});

export { About };

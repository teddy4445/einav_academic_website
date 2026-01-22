/* ================= SEARCH (SAFE VERSION) ================= */

// ---- CONFIG ----
const PARAM_QUERY = "query";

// ---- DATA ----
let docs = [];
docs.push({
  id: "1",
  body: "Example",
  shortBody: "Example",
  title: "Example",
  url: "/index.html",
});

// ---- INDEX ----
var index = elasticlunr(function () {
  this.addField("title");
  this.addField("body");
  this.setRef("id");
});

for (let i = 0; i < docs.length; i++) {
  index.addDoc(docs[i]);
}

/* ================= SEARCH ACTIONS ================= */

function searchPage() {
  const desktopInput = document.getElementById("search_input");
  const mobileInput = document.getElementById("search_input_mobile");

  let query = "";

  if (desktopInput && desktopInput.value) {
    query = desktopInput.value.toLowerCase().trim();
  }

  if (!query && mobileInput && mobileInput.value) {
    query = mobileInput.value.toLowerCase().trim();
  }

  if (!query) {
    showSearchAlert("Please enter a query in order to search in the website");
    return false;
  }

  const results = index.search(query, {
    fields: {
      title: { boost: 2 },
      body: { boost: 1 },
    },
  });

  if (results.length === 0) {
    showSearchAlert("We were not able to find any result in the website for your query");
    return false;
  } else if (results.length === 1) {
    const doc = docs[parseInt(results[0].ref, 10) - 1];
    if (doc) window.open(doc.url);
    return false;
  } else {
    window.open("/search.html?" + PARAM_QUERY + "=" + encodeURIComponent(query));
  }
}

/* ================= SEARCH RESULTS PAGE ================= */

function update_search_results() {
  const resultsContainer = document.getElementById("search-results");
  const queryLabel = document.getElementById("query");

  if (!resultsContainer || !queryLabel) return;

  const query = decodeURIComponent(GetParamsLoad(PARAM_QUERY) || "");
  if (!query) {
    window.location.replace("404.html");
    return;
  }

  queryLabel.innerHTML = query;

  const results = index.search(query, {
    fields: {
      title: { boost: 2 },
      body: { boost: 1 },
    },
  });

  let scores_norm = 0;
  for (let i = 0; i < results.length; i++) {
    scores_norm += results[i].score;
  }

  let html = "";
  for (let i = 0; i < results.length; i++) {
    const doc = docs[parseInt(results[i].ref, 10) - 1];
    if (!doc) continue;

    html += buildSearchResultAnswer(
      i,
      doc.title,
      results[i].score / scores_norm,
      doc.shortBody,
      doc.url
    );
  }

  resultsContainer.innerHTML = html;
}

/* ================= HELPERS ================= */

function GetParamsLoad(param_name) {
  return (window.location.search.match(new RegExp("[?&]" + param_name + "=([^&]+)")) || [, null])[1];
}

function buildSearchResultAnswer(index, title, score, short_body, url) {
  const label = url.replace("/", "").split(".")[0].toUpperCase();
  return `
    <div class="academic-papers-panel">
      <div class="personal-row-col col-reverse-mobile w-100 align-space-between">
        <h3>${title}</h3>
      </div>
      <h4>${short_body}</h4>
      <p class="search-date">Fitting ${Math.round(score * 100)}% to query</p>
      <div class="personal-row space-between-search align-items-center mobile-row-breaker">
        <div class="search-parms-row">
          <span class="search-label">${label}</span>
        </div>
        <a href="${url}" class="secondary-btn">See this page</a>
      </div>
    </div>`;
}

function showSearchAlert(alertText) {
  const closeBtn = document.getElementById("search-close-btn");
  const alertTextEl = document.getElementById("search-alert");

  if (!closeBtn || !alertTextEl) return;

  const alertDiv = closeBtn.parentElement;
  alertTextEl.innerHTML = alertText;

  alertDiv.style.opacity = "1";
  setTimeout(() => {
    alertDiv.style.opacity = "0";
  }, 2500);
}

/* ================= EVENT BINDING ================= */

(function bindSearchEvents() {
  const desktopInput = document.getElementById("search_input");
  if (desktopInput) {
    desktopInput.onkeyup = function (e) {
      if (e.keyCode === 13) searchPage();
    };
  }

  const mobileInput = document.getElementById("search_input_mobile");
  if (mobileInput) {
    mobileInput.onkeyup = function (e) {
      if (e.keyCode === 13) searchPage();
    };
  }
})();

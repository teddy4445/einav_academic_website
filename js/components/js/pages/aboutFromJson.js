import { Icons } from "../icons.js";

async function loadAboutPage() {
  // Update path if your JSON is elsewhere:
  const res = await fetch("/data/about.json");
  const data = await res.json();

  // --------- HEADER TEXT -----------
  const nameEl = document.getElementById("lecturer_name");
  const posEl = document.getElementById("lecturer_position");
  const bioEl = document.getElementById("bio_text");

  if (nameEl) nameEl.textContent = data.name || "";
  if (posEl) posEl.textContent = data.position || "";
  if (bioEl) bioEl.textContent = data.bio || "";

  // --------- CONTACT ICONS (DESKTOP + MOBILE) -----------
  const contactsEl = document.getElementById("contacts");
  const contactsMobileEl = document.getElementById("contacts-mobile");

  const mail = data.mail || data.email || "";
  const phone = data.phone || "";
  const linkedin = data.linkedin_link || "";
  const google = data.google_scholar_link || "";
  const orcid = data.orcid_link || "";

  function buildIconLink(href, svg, label) {
    if (!href) return "";
    const safeLabel = label ? `aria-label="${label}" title="${label}"` : "";
    return `
      <a class="contact-icon" href="${href}" target="_blank" rel="noopener noreferrer" ${safeLabel}>
        ${svg}
      </a>
    `;
  }

  // mail & phone need special href formats
  const mailHref = mail ? `mailto:${mail}` : "";
  const phoneHref = phone ? `tel:${phone}` : "";

  const iconsHtml = `
    <div class="contacts-icons">
      ${buildIconLink(mailHref, Icons.mail(), "Email")}
      ${buildIconLink(phoneHref, Icons.phone(), "Phone")}
      ${buildIconLink(linkedin, Icons.linkedin(), "LinkedIn")}
      ${buildIconLink(google, Icons.google(), "Google Scholar")}
      ${buildIconLink(orcid, Icons.orcid(), "ORCID")}
    </div>
  `;

  if (contactsEl) contactsEl.innerHTML = iconsHtml;
  if (contactsMobileEl) contactsMobileEl.innerHTML = iconsHtml;

  // --------- OPTIONAL: TABLE ICONS (organization / room / hours) -----------
  // Only if your JS uses these; safe placeholders:
  const orgEl = document.getElementById("organization");
  const roomEl = document.getElementById("room");
  const hoursEl = document.getElementById("hours");

  // If your site already fills these elsewhere, delete this block.
  if (orgEl && data.organization) orgEl.textContent = data.organization;
  if (roomEl && data.room) roomEl.textContent = data.room;
  if (hoursEl && data.office_hours) hoursEl.textContent = data.office_hours;
}

document.addEventListener("DOMContentLoaded", loadAboutPage);

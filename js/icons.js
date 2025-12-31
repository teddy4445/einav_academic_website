// /js/icons.js
// Font Awesome 4.4 compatible icon set
// Single source of truth for icons used across the site

const icon = (faClass, label) =>
  `<span class="fa ${faClass}" aria-hidden="true" title="${label}"></span>`;

const Icons = {
  // Contact
  mail: () => icon("fa-envelope", "Email"),
  mail_mobile: () => icon("fa-envelope", "Email"),
  phone: () => icon("fa-phone", "Phone"),
  cv: () => icon("fa-file-pdf-o", "Download CV"),

  // Social / academic
  linkedin: () => icon("fa-linkedin", "LinkedIn"),
  google: () => icon("fa-graduation-cap", "Google Scholar"),
  // Font Awesome 4.4 has no ORCID icon → use ID badge
  orcid: () => icon("fa-id-badge", "ORCID"),
  about_facebook: () => icon("fa-facebook", "Facebook"),
  github: () => icon("fa-github", "GitHub"),

  // UI / layout
  info: () => icon("fa-info-circle", "Information"),
  filter: () => icon("fa-filter", "Filter"),
  reset: () => icon("fa-refresh", "Reset"),
  buildings: () => icon("fa-university", "Organization"),
  location: () => icon("fa-map-marker", "Location"),
  clock: () => icon("fa-clock-o", "Office hours"),
};

export { Icons };
export default Icons;

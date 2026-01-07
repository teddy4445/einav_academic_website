import { Element } from "/js/components/element.js";
import { CourseResource } from "/js/components/courseResource.js";
import { CourseUpdate } from "/js/components/courseUpdate.js";
import { CourseModule } from "/js/components/courseModule.js";
import { descriptionTrim } from "/js/descriptionSlicer.js";
import { Icons } from "/js/components/icons.js";

class Course extends Element {
  constructor(
    name,
    passkey,
    description,
    code,
    year,
    semester,
    university,
    department,
    location_class,
    syllabus,
    grade_parts,
    resources,
    updates,
    modules
  ) {
    super();
    this.name = name || "";
    this.passkey = passkey || "";
    this.description = description || "";
    this.code = code || "";
    this.year = year || "";
    this.semester = semester || "";
    this.university = university || "";
    this.department = department || "";
    this.location_class = location_class || "";
    this.syllabus = syllabus || "";

    this.grade_parts = Array.isArray(grade_parts) ? grade_parts : [];
    this.resources = Array.isArray(resources) ? resources : [];
    this.updates = Array.isArray(updates) ? updates : [];
    this.modules = Array.isArray(modules) ? modules : [];

    this.newCounter = 0;
  }

  toHtml(lastVisit = null) {
    if (!lastVisit) lastVisit = new Date(2000, 1, 1, 0, 0, 0, 0);

    let html = "";
    html += this.createGeneralData(lastVisit);
    html += this.createUpdateData(lastVisit);
    html += this.createModuleData(lastVisit);
    return html;
  }

  createGeneralData(lastVisit) {
    try {
      let html = '<div class="body-section">';
      html += this.createSummary(lastVisit);
      html += this.createResourceList(lastVisit);
      html += "</div>";
      return html;
    } catch (error) {
      console.log("Error at Course.createGeneralData:", error);
      return "";
    }
  }

  createSummary(lastVisit) {
    const grades = Array.isArray(this.grade_parts) ? this.grade_parts : [];

    let subTitle = "N/A";
    if (grades.length > 0) {
      subTitle = grades
        .map((g) => `${g?.name || "Part"} (${g?.percent ?? 0}%)`)
        .join(", ");
    }

    const text = descriptionTrim(this.description || "", "summary", "content-text");

    return (
      '<div class="summary-section">' +
      '<h3 class="content-title">Summary</h3>' +
      '<hr class="blue-hr">' +
      `<h2 class="content-subtitle">Final grade: ${subTitle}</h2>` +
      text +
      `<div class="section-seperator">${Icons.dots_seperator()}<div class="main-dot"></div><div class="main-dot"></div><div class="main-dot"></div></div>` +
      "</div>"
    );
  }

  createResourceList(lastVisit) {
    try {
      if (!Array.isArray(this.resources) || this.resources.length === 0) {
        return '<div class="resources-section"><h3 class="content-title">Resources</h3><hr class="blue-hr"><p class="content-text">No resources yet.</p></div>';
      }

      let html =
        '<div class="resources-section"><h3 class="content-title">Resources</h3><hr class="blue-hr">';

      this.resources.forEach((resourceEntry) => {
        if (!resourceEntry || typeof resourceEntry !== "object") return;

        for (const resourceType in resourceEntry) {
          const list = Array.isArray(resourceEntry[resourceType])
            ? resourceEntry[resourceType]
            : [];

          html +=
            '<div class="resource"><ul class="resource-list"><li class="content-subtitle"><h5 class="resource-list-item-title">' +
            resourceType +
            "</h5>";

          list.forEach((resourceProperties) => {
            const resource = CourseResource.createFromJson(resourceProperties);
            html += resource?.toHtml ? resource.toHtml() : "";
          });

          html += "</li></ul></div>";
        }
      });

      html += "</div>";
      return html;
    } catch (e) {
      console.log("Error at Course.createResourceList:", e);
      return "";
    }
  }

  createUpdateData(lastVisit) {
    try {
      let html = '<div class="body-section">';

      for (let i = 0; i < this.updates.length; i++) {
        html += this.updates[i]?.toHtml ? this.updates[i].toHtml(lastVisit) : "";

        if (this.updates[i]?.last_html_flag_show) this.newCounter++;

        if (i !== this.updates.length - 1) {
          html += `<div class="section-seperator">${Icons.dots_seperator()}</div>`;
        }
      }

      html += "</div>";
      return html;
    } catch (error) {
      console.log("Error at Course.createUpdateData:", error);
      return "";
    }
  }

  createModuleData(lastVisit) {
    try {
      let html = '<div class="body-section">';

      for (let i = 0; i < this.modules.length; i++) {
        html += this.modules[i]?.toHtml ? this.modules[i].toHtml(lastVisit) : "";

        if (i !== this.modules.length - 1) {
          html += '<div class="section-seperator"><div class="main-dot"></div><div class="main-dot"></div><div class="main-dot"></div></div>';
        }
      }

      html += "</div>";
      return html;
    } catch (error) {
      console.log("Error at Course.createModuleData:", error);
      return "";
    }
  }

  static createListFromJson(jsonObj) {
    if (!Array.isArray(jsonObj)) return [];
    return jsonObj.map((x) => Course.createFromJson(x)).filter(Boolean);
  }

  static createFromJson(jsonObj) {
    if (!jsonObj || typeof jsonObj !== "object") return null;

    return new Course(
      jsonObj["name"],
      jsonObj["passkey"],
      jsonObj["description"],
      jsonObj["code"],
      jsonObj["year"],
      jsonObj["semester"],
      jsonObj["university"],
      jsonObj["department"],
      jsonObj["location_class"],
      jsonObj["syllabus"],
      jsonObj["grade_parts"],
      CourseResource.createListFromJson(jsonObj["resources"]),
      CourseUpdate.createListFromJson(jsonObj["updates"]),
      CourseModule.createListFromJson(jsonObj["modules"])
    );
  }
}

export { Course };

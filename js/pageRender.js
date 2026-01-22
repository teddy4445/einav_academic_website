// Data file paths
const PLACE_HOLDER = "{}";
const SEO_JSON = "/data/jsons/seo/[].json";
const MAIN_JSON = "/data/jsons/[].json";

// globals //
let retrivedData = null;

// abstract class that each page implements to get dynamic data from the server side
class PageRender {
  constructor() {}

  static build() {
    throw new Error("NotImplemented: Build");
  }

  // guess the main files in the server if not provided
  static guessDataLocation() {
    let pageName = location.pathname.split("/").slice(-1)[0];
    if (pageName === "") pageName = "index";

    return {
      seo: SEO_JSON.replace(PLACE_HOLDER, pageName),
      main: MAIN_JSON.replace(PLACE_HOLDER, pageName),
    };
  }

  // read parameters from the page's url as HTTP get
  static readGetPrams() {
    return new URLSearchParams(new URL(window.location.href).search);
  }

  /**
   * Load data from server and put it in global var 'retrivedData'.
   * NOTE: This is synchronous to match your current codebase.
   */
  static loadFileFromServer(filePath, is_json = false) {
    try {
      // IMPORTANT: create a new request each time (no shared global XHR)
      const xhr = new XMLHttpRequest();
      xhr.open("GET", filePath, false); // synchronous

      xhr.send(null);

      // Only decide success/failure ONCE, after send
      if (xhr.status >= 200 && xhr.status < 300) {
        const text = xhr.responseText ?? "";

        if (is_json) {
          try {
            retrivedData = JSON.parse(text);
          } catch (e) {
            console.error("JSON parse failed for:", filePath, e);
            retrivedData = null;
          }
        } else {
          retrivedData = text;
        }
      } else {
        console.error("Request failed:", filePath, xhr.status);
        retrivedData = null;
      }

      return retrivedData;
    } catch (error) {
      console.error("Error at PageRender.loadFileFromServer:", error);
      retrivedData = null;
      return null;
    }
  }
}

export { PageRender, retrivedData };

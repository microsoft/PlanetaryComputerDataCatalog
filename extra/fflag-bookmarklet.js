/* Heavily inspired by https://www.webtips.dev/feature-flags-in-react */

/* eslint-disable no-unused-labels */
/* eslint-disable no-labels */
javascript: (() => {
  const flags = JSON.parse(localStorage.getItem("flags"));

  const styles = `
    .ff-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        background: radial-gradient(#ccc, transparent);
        height: 100%;
        width: 100%;
    }
    .ff-inner {
        position: absolute;
        top: 100px;
        background: white;
        border: 2px solid;
        padding: 20px;
        left: 25%;
    }
    .ff-container {
        padding: 20px 0;
    }
  `;

  const style = document.createElement("style");
  style.appendChild(document.createTextNode(styles));

  document.head.appendChild(style);
  // Check if there are feature flags on the site
  if (flags && flags.length) {
    // Create a layout for the bookmarklet
    const html = `
            <main class="ff-wrapper">
                <div class="ff-inner">
                    <h2 class="ff-header">Feature flags</h2>
                    <p>Configure local feature flags</p>
                    <div class="ff-container">
                    <table class="ff-table">
                        ${flags
                          .map((flag, index) => {
                            return `
                                <tr class="ff-row">
                                    <td class="ff-column">
                                        <strong class="ff-title">${
                                          flag.name
                                        }</strong>
                                        <span class="ff-description">${
                                          flag.description
                                        }</span>
                                    </td>
                                    <td class="ff-column">
                                        <label class="ff-label">
                                            <input type="checkbox" ${
                                              flag.active ? "checked" : ""
                                            } class="ff-input" data-index="${index}"/>
                                        </label>
                                    </td>
                                </tr>
                            `;
                          })
                          .join("")}
                    </table>
                    </div>

                    <button class="ff-reload manual-ms-button manual-ms-secondary">Reset flags</button>
                    <button class="ff-apply manual-ms-button manual-ms-primary">Apply changes</button>
                <div>
            </main>
        `;

    // Add the bookmarklet to the document
    document.body.append(
      new DOMParser()
        .parseFromString(html, "text/html")
        .getElementsByTagName("main")[0]
    );

    const nodes = [...document.querySelectorAll(".ff-input")];

    // Add an event listener for the toggles
    nodes.forEach(feature => {
      feature.onclick = e => {
        flags[Number(e.target.dataset.index)].active = e.target.checked;
        localStorage.setItem("flags", JSON.stringify(flags));
      };
    });

    // Add an event listener for refreshing the flags
    document.querySelector(".ff-reload").addEventListener("click", () => {
      localStorage.clear();
      window.location.reload();
    });

    // Add an event listener for applying changes
    document.querySelector(".ff-apply").addEventListener("click", () => {
      window.location.reload();
    });
  } else {
    alert("No feature flags on site");
  }
})();

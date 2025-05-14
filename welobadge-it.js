(function () {
  const scripts = document.querySelectorAll('script[data-url]');
  const thisScript = scripts[scripts.length - 1];
  const targetURL = thisScript?.getAttribute("data-url") || "https://welobadge.com";

  if (!targetURL || targetURL === "https://welobadge.com") {
    console.warn("[Welo Badge] ⚠ Nessun data-url trovato o URL non valido. Verrà usata la home page come fallback.");
  } else {
    console.log("[Welo Badge] ✅ URL caricato:", targetURL);
  }

  function initBadge() {
    const badge = document.createElement("div");
    badge.className = "welo-badge";
    badge.innerHTML = `
      <div class="welo-logo-container">
        <img class="welo-logo" src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/682461741cc0cd01187ea413_Rectangle%207089%201.png" alt="Welo Logo" />
      </div>
      <div class="welo-text">
        <span class="welo-title">Welo Badge</span>
        <span class="welo-subtitle">Azienda Certificata</span>
      </div>
    `;

    const modal = document.createElement("div");
    modal.id = "welo-overlay";
    modal.style.display = "none";
    modal.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;">
        <div style="position:relative;width:90%;max-width:800px;height:80%;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
          <button id="welo-close-btn" style="position:absolute;top:10px;right:10px;background:#000;color:#fff;border:none;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:1001;">✕</button>
          <iframe src="` + targetURL + `" style="width:100%;height:100%;border:none;" loading="lazy"></iframe>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .welo-badge {
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 999px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        font-family: 'Inter', sans-serif;
        cursor: pointer;
        height: 52px;
        min-width: 52px;
        max-width: 52px;
        overflow: hidden;
        transition: all 0.4s ease;
        z-index: 9999;
      }

      .welo-logo-container {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: width 0.3s ease;
      }

      .welo-logo {
        width: 24px;
        height: 24px;
        object-fit: contain;
        transition: margin 0.3s ease;
      }

      .welo-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        opacity: 0;
        margin-left: 0;
        padding-right: 0;
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .welo-title {
        font-size: 16px;
        font-weight: 600;
        color: #1b1b1b;
        line-height: 1.2;
      }

      .welo-subtitle {
        font-size: 11px;
        font-weight: 400;
        color: #1b1b1b;
        line-height: 1;
        margin-top: 3px;
      }

      .welo-badge.open {
        max-width: 200px;
      }

      .welo-badge.open .welo-text {
        opacity: 1;
        margin-left: 8px;
        padding-right: 15px;
      }

      @media (hover: hover) {
        .welo-badge:hover {
          max-width: 200px;
        }
        .welo-badge:hover .welo-text {
          opacity: 1;
          margin-left: 8px;
          padding-right: 15px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(badge);
    document.body.appendChild(modal);

    let badgeExpanded = false;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    badge.addEventListener("click", () => {
      if (isTouch) {
        if (!badgeExpanded) {
          badge.classList.add("open");
          badgeExpanded = true;
        } else {
          modal.style.display = "block";
        }
      } else {
        modal.style.display = "block";
      }
      badge.classList.add("open");
    });

    document.addEventListener("click", function (e) {
      if (e.target.id === "welo-close-btn") {
        modal.style.display = "none";
        badge.classList.remove("open");
        badgeExpanded = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBadge);
  } else {
    initBadge();
  }
})();

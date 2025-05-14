document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("welo-badge");
  if (!el) return;

  const company = el.dataset.company || "default";
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let badgeExpanded = false;

  // Crea elementi
  const wrapper = document.createElement("div");
  wrapper.className = "welo-badge-wrapper";
  wrapper.innerHTML = `
    <div class="welo-inner">
      <div class="welo-logo-container">
        <img class="welo-logo" src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/682461741cc0cd01187ea413_Rectangle%207089%201.png" alt="Welo Logo">
      </div>
      <div class="welo-text">
        <span class="welo-title">Welo Badge</span>
        <span class="welo-subtitle">Azienda Certificata</span>
      </div>
    </div>
    <div class="welo-modal" id="welo-modal">
      <div class="welo-modal-content">
        <button class="welo-close" id="welo-close">✕</button>
        <iframe src="https://welobadge.com/welo-page/${company}" loading="lazy"></iframe>
      </div>
    </div>
  `;

  el.replaceWith(wrapper);

  // Inietta CSS globale
  const style = document.createElement("style");
  style.textContent = `
    .welo-badge-wrapper {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
    }

    .welo-inner {
      display: flex;
      align-items: center;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 999px;
      height: 52px;
      min-width: 52px;
      max-width: 52px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: max-width 0.4s ease;
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
    }

    .welo-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      opacity: 0;
      margin-left: 0;
      padding-right: 0;
      transition: opacity 0.3s ease, margin-left 0.3s ease, padding 0.3s ease;
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
      margin-top: 3px;
      line-height: 1;
    }

    .welo-inner.expanded {
      max-width: 200px;
    }

    .welo-inner.expanded .welo-logo-container {
      width: 38px;
    }

    .welo-inner.expanded .welo-text {
      opacity: 1;
      margin-left: 4px;
      padding-right: 10px;
    }

    .welo-modal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7);
      align-items: center;
      justify-content: center;
      z-index: 99999;
    }

    .welo-modal-content {
      position: relative;
      width: 90%;
      max-width: 800px;
      height: 80%;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .welo-modal-content iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .welo-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
    }
  `;
  document.head.appendChild(style);

  const badge = wrapper.querySelector(".welo-inner");
  const modal = wrapper.querySelector("#welo-modal");
  const closeBtn = wrapper.querySelector("#welo-close");

  function expandBadge() {
    badge.classList.add("expanded");
  }

  function collapseBadge() {
    badge.classList.remove("expanded");
  }

  if (isTouch) {
    badge.addEventListener("click", () => {
      if (!badgeExpanded) {
        expandBadge();
        badgeExpanded = true;
      } else {
        modal.style.display = "flex";
      }
    });
  } else {
    badge.addEventListener("mouseenter", expandBadge);
    badge.addEventListener("mouseleave", collapseBadge);
    badge.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    collapseBadge();
    badgeExpanded = false;
  });
});



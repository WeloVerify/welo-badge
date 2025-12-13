(function () {
  const scripts = document.querySelectorAll("script[data-url]");
  const thisScript = scripts[scripts.length - 1];

  const targetURL = thisScript?.getAttribute("data-url") || "https://welobadge.com";

  const forcedCompany =
    thisScript?.getAttribute("data-company") ||
    thisScript?.getAttribute("data-company-name") ||
    "";

  function titleCase(str) {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\s+/g, " ")
      .trim();
  }

  function sanitizeCompanyName(name) {
    return String(name || "")
      .replace(/\s+/g, " ")
      .replace(/[.\s]+$/g, "")
      .trim();
  }

  function deriveCompanyName(url) {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      let slug = parts[parts.length - 1] || "";

      if (!slug || slug.length < 2) slug = u.hostname || "";

      slug = slug
        .replace(/[-_]+/g, " ")
        .replace(/\b(com|net|org|io|co|it|eu|uk|us)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!slug) {
        const host = (u.hostname || "").replace(/^www\./i, "");
        const base = host.split(".")[0] || "Azienda";
        return titleCase(base);
      }

      return titleCase(slug);
    } catch (e) {
      return "Azienda";
    }
  }

  function initBadge() {
    if (document.getElementById("welo-badge-wrap") || document.getElementById("welo-overlay")) return;

    const companyName = sanitizeCompanyName(forcedCompany || deriveCompanyName(targetURL)) || "Azienda";

    // ===== CONFIG =====
    const SHOW_CIRCLE_AFTER_MS = 250;
    const EXPAND_AFTER_MS = 4600;

    const TITLE_TEXT = "Certificazione Welo Badge";

    const ROTATION = [
      { text: "Azienda verificata da Welo", duration: 4200 },
      { text: `Scopri perché ${companyName} è sicura`, duration: 4200 },
      { text: "Guarda le recensioni verificate", duration: 4200 },
    ];

    // ===== Wrapper + Pill =====
    const wrap = document.createElement("div");
    wrap.id = "welo-badge-wrap";
    wrap.className = "welo-badge-wrap";

    wrap.innerHTML = `
      <div class="welo-pill" id="welo-pill" role="button" tabindex="0" aria-label="Welo Badge">
        <div class="welo-logo-container" id="welo-logo-container">
          <img
            class="welo-logo"
            src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/682461741cc0cd01187ea413_Rectangle%207089%201.png"
            alt="Welo Logo"
          />
        </div>

        <div class="welo-text" id="welo-text">
          <span class="welo-title" id="welo-dynamic-title">${TITLE_TEXT}</span>
          <span class="welo-subtitle" id="welo-dynamic-subtitle">${ROTATION[0].text}</span>
        </div>
      </div>

      <button class="welo-badge-dismiss" type="button" aria-label="Chiudi badge">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6L18 18M18 6L6 18"></path>
        </svg>
      </button>
    `;

    // ===== Modal =====
    const modal = document.createElement("div");
    modal.id = "welo-overlay";
    modal.className = "welo-overlay";
    modal.style.display = "none";
    modal.innerHTML = `
      <div class="welo-modal">
        <div class="welo-modal-header">
          <h3>Welo Badge</h3>
          <div class="welo-header-buttons">
            <button class="welo-open-btn" id="welo-open-btn">
              <img src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/68553e0f860d1da7b26f8f9f_Vector.svg" width="14" height="14" alt="Apri" />
              <span class="welo-btn-text">Apri Welo Page</span>
            </button>
            <button class="welo-fullscreen-btn" id="welo-fullscreen-btn" aria-label="Fullscreen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
            <button class="welo-close-btn" id="welo-close-btn" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="welo-iframe-container">
          <iframe
            id="welo-iframe"
            src="${targetURL}"
            style="width:100%; height:100%; border:none; font-family: 'Inter', sans-serif;"
            loading="lazy"></iframe>
        </div>
      </div>
    `;

    // ===== Styles =====
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

      :root{
        --welo-pill-width: 300px; /* overwritten by JS */
        --welo-stroke: #DBDBDB;
        --welo-shadow: 0px 4px 10px rgba(0,0,0,0.08);
        --welo-shadow-hover: 0px 6px 14px rgba(0,0,0,0.09);
      }

      .welo-badge-wrap,
      .welo-badge-wrap *{
        box-sizing: border-box;
      }

      .welo-badge-wrap{
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

        /* ✅ evita “text autosizing” iOS che può sballare le altezze */
        -webkit-text-size-adjust: 100%;

        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
        transition: opacity 260ms ease, transform 260ms ease;
      }

      .welo-badge-wrap.is-visible{
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      /* PILL */
      .welo-pill{
        height: 56px;
        width: 56px; /* circle initial */
        border-radius: 999px;
        overflow: hidden;

        display:flex;
        align-items:center;

        background:#fff;
        border:1px solid var(--welo-stroke);
        box-shadow: var(--welo-shadow);

        cursor:pointer;
        -webkit-tap-highlight-color: transparent;

        transition:
          width 560ms cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 200ms ease;
      }

      .welo-badge-wrap.is-expanded .welo-pill{
        width: var(--welo-pill-width);
      }

      .welo-pill:hover{
        box-shadow: var(--welo-shadow-hover);
      }

      .welo-logo-container{
        width:56px;
        height:56px;
        flex:0 0 56px;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .welo-logo{
        width:28px;
        height:28px;
        object-fit:contain;
        transition: transform 220ms ease;
      }

      .welo-pill:active .welo-logo{ transform: scale(0.97); }

      .welo-text{
        flex:1;
        min-width:0;

        display:flex;
        flex-direction:column;
        justify-content:center;

        gap:3px;

        opacity:0;
        transform: translateX(-10px);

        transition:
          opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 320ms cubic-bezier(0.22, 1, 0.36, 1);

        /* ✅ FIX “g tagliata”: un filo di padding verticale */
        padding: 1px 15px 2px 0px;
      }

      .welo-badge-wrap.is-expanded .welo-text{
        opacity:1;
        transform: translateX(0);
      }

      /* ✅ NO PUNTINI (PC + MOBILE) + FIX DESCENDERS */
      .welo-title{
        display:block;
        font-size:16px;
        font-weight:600;
        color:#141414;

        /* ✅ line-height più “safe” per discendenti (g,p,y) */
        line-height:1.22;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
      }

      .welo-subtitle{
        display:block;
        font-size:12px;
        font-weight:400;
        color:#8A8A8A;

        /* ✅ anche qui safe */
        line-height:1.22;

        white-space:nowrap;
        overflow:hidden;
        text-overflow: clip;

        transition:
          opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
        will-change: opacity, transform;
      }

      .welo-subtitle.welo-subtitle-out{ opacity:0; transform: translateY(8px); }
      .welo-subtitle.welo-subtitle-prein{ opacity:0; transform: translateY(-8px); }

      /* X CIRCLE */
      .welo-badge-dismiss{
        position:absolute;
        top: -6px;
        right: -6px;

        width:25px;
        height:25px;
        border-radius:999px;

        background:#fff;
        border:1px solid var(--welo-stroke);
        box-shadow: var(--welo-shadow);

        display:flex;
        align-items:center;
        justify-content:center;

        cursor:pointer;

        opacity:0;
        pointer-events:none;
        transition: opacity 220ms ease;

        appearance:none;
        -webkit-appearance:none;
        padding:0;
        margin:0;
        touch-action: manipulation;
      }

      .welo-badge-dismiss svg{
        width:14px;
        height:14px;
        display:block;
        stroke:#111;
        stroke-width:2.8;
        stroke-linecap:round;
        fill:none;
      }

      .welo-badge-wrap.is-expanded .welo-badge-dismiss{
        opacity:1;
        pointer-events:auto;
      }

      /* ===== MODAL ===== */
      .welo-overlay{
        display:none;
        position:fixed;
        inset:0;
        background: rgba(0,0,0,0.75);
        backdrop-filter: blur(4px);
        z-index:10000;
        align-items:center;
        justify-content:center;
        opacity:0;
        transition: opacity 0.3s ease;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .welo-overlay.show{ opacity:1; }

      .welo-modal{
        width:95%;
        max-width:1200px;
        height:90%;
        max-height:800px;
        background:#fff;
        border-radius:16px;
        overflow:hidden;
        box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        transform: scale(0.94) translateY(18px);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        display:flex;
        flex-direction:column;
      }
      .welo-overlay.show .welo-modal{ transform: scale(1) translateY(0); }

      .welo-modal.fullscreen{
        width:100vw;
        height:100vh;
        max-width:100vw;
        max-height:100vh;
        border-radius:0;
        transform:none;
        position:fixed;
        inset:0;
        margin:0;
      }

      .welo-modal-header{
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding:16px 40px;
        border-bottom:1px solid #e9ecef;
        background:#f8f9fa;
        flex-shrink:0;
      }

      .welo-modal-header h3{
        margin:0;
        font-size:18px;
        font-weight:600;
        color:#1a1a1a;
      }

      .welo-header-buttons{ display:flex; align-items:center; gap:12px; }

      .welo-open-btn{
        display:flex;
        align-items:center;
        gap:8px;
        background:#D8EDFF;
        color:#0285FF;
        border:none;
        border-radius:100px;
        padding:8px 16px;
        font-size:14px;
        font-weight:600;
        cursor:pointer;
        transition: all 0.2s ease;
      }
      .welo-open-btn:hover{ background:#c8e5ff; transform: translateY(-1px); }

      .welo-fullscreen-btn,
      .welo-close-btn{
        display:flex;
        align-items:center;
        justify-content:center;
        background:#f8f9fa;
        color:#6b7280;
        border:1px solid #e9ecef;
        border-radius:8px;
        width:36px;
        height:36px;
        cursor:pointer;
        transition: all 0.2s ease;
      }
      .welo-fullscreen-btn:hover,
      .welo-close-btn:hover{ background:#e9ecef; color:#1a1a1a; }

      .welo-iframe-container{ flex:1; min-height:0; background:#fff; }

      @media (max-width: 768px){
        .welo-badge-wrap{ bottom:30px; left:18px; }

        .welo-pill{ height:52px; width:52px; }
        .welo-logo-container{ width:52px; height:52px; flex:0 0 52px; }
        .welo-logo{ width:26px; height:26px; }

        .welo-title{ font-size:15px; line-height:1.22; }
        .welo-subtitle{ font-size:11px; line-height:1.22; }

        /* ✅ stesso fix anche mobile */
        .welo-text{ padding: 1px 12px 2px 0px; }

        .welo-badge-dismiss{
          width:24px;
          height:24px;
          top:-6px;
          right:-6px;
        }
        .welo-badge-dismiss svg{
          width:13px;
          height:13px;
          stroke-width:2.8;
        }

        .welo-modal{ width:95%; height:90%; border-radius:10px; }
        .welo-modal-header{ padding:16px 18px; gap:8px; flex-wrap:wrap; }
        .welo-btn-text{ display:none; }
        .welo-fullscreen-btn, .welo-close-btn{ width:32px; height:32px; }
        .welo-fullscreen-btn svg, .welo-close-btn svg{ width:14px; height:14px; }
      }

      @media (prefers-reduced-motion: reduce){
        .welo-badge-wrap, .welo-pill, .welo-text, .welo-subtitle{ transition:none !important; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(wrap);
    document.body.appendChild(modal);

    const pill = document.getElementById("welo-pill");
    const dismissBtn = wrap.querySelector(".welo-badge-dismiss");
    const titleEl = document.getElementById("welo-dynamic-title");
    const subEl = document.getElementById("welo-dynamic-subtitle");
    const logoContainer = document.getElementById("welo-logo-container");
    const textWrap = document.getElementById("welo-text");

    // ===== Width (accuratissimo) =====
    function measureWithFont(text, font, letterSpacing) {
      const span = document.createElement("span");
      span.style.position = "fixed";
      span.style.left = "-9999px";
      span.style.top = "-9999px";
      span.style.visibility = "hidden";
      span.style.whiteSpace = "nowrap";
      span.style.font = font;
      if (letterSpacing) span.style.letterSpacing = letterSpacing;
      span.textContent = text;
      document.body.appendChild(span);
      const w = span.getBoundingClientRect().width;
      span.remove();
      return w;
    }

    function computePillWidth() {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const logoW = logoContainer ? logoContainer.getBoundingClientRect().width : (isMobile ? 52 : 56);
      const padRight = textWrap ? parseFloat(getComputedStyle(textWrap).paddingRight || "0") : (isMobile ? 10 : 12);

      const titleStyle = titleEl ? getComputedStyle(titleEl) : null;
      const subStyle = subEl ? getComputedStyle(subEl) : null;

      const titleFont = titleStyle?.font || "600 16px Inter";
      const titleLS = titleStyle?.letterSpacing || "";
      const subFont = subStyle?.font || "500 12px Inter";
      const subLS = subStyle?.letterSpacing || "";

      let maxText = 0;
      maxText = Math.max(maxText, measureWithFont(TITLE_TEXT, titleFont, titleLS));
      for (const s of ROTATION) {
        maxText = Math.max(maxText, measureWithFont(s.text, subFont, subLS));
      }

      const fudge = 6;
      let w = logoW + maxText + padRight + fudge;

      const maxAllowed = Math.min(520, window.innerWidth - 44);
      const minAllowed = 220;

      w = Math.max(minAllowed, Math.min(maxAllowed, Math.ceil(w)));
      document.documentElement.style.setProperty("--welo-pill-width", `${w}px`);
    }

    computePillWidth();
    window.addEventListener("resize", computePillWidth);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        computePillWidth();
        setTimeout(computePillWidth, 150);
      });
    } else {
      setTimeout(computePillWidth, 500);
    }

    // ===== State / timers =====
    let userCollapsed = false;
    let tShow = null;
    let tExpand = null;
    let tRotate = null;
    let isFullscreen = false;

    function clearTimers() {
      if (tShow) clearTimeout(tShow);
      if (tExpand) clearTimeout(tExpand);
      if (tRotate) clearTimeout(tRotate);
      tShow = tExpand = tRotate = null;
    }

    function animateSubtitleTo(text) {
      if (!subEl) return;
      if (subEl.textContent === text) return;

      subEl.classList.add("welo-subtitle-out");

      setTimeout(() => {
        subEl.textContent = text;

        subEl.classList.remove("welo-subtitle-out");
        subEl.classList.add("welo-subtitle-prein");

        requestAnimationFrame(() => {
          subEl.classList.remove("welo-subtitle-prein");
        });
      }, 320);
    }

    function startRotation() {
      let idx = 0;
      const loop = () => {
        if (userCollapsed) return;
        const item = ROTATION[idx % ROTATION.length];
        animateSubtitleTo(item.text);
        idx++;
        tRotate = setTimeout(loop, item.duration);
      };
      loop();
    }

    function showCircle() {
      wrap.classList.add("is-visible");
    }

    function expandPill() {
      if (userCollapsed) return;
      wrap.classList.add("is-expanded");
      setTimeout(computePillWidth, 50);
      startRotation();
    }

    function collapseToCircle() {
      userCollapsed = true;
      clearTimers();
      wrap.classList.remove("is-expanded");
      if (subEl) subEl.textContent = ROTATION[0].text;
    }

    // ===== Modal =====
    function toggleFullscreen() {
      const modalEl = document.querySelector(".welo-modal");
      isFullscreen = !isFullscreen;

      if (isFullscreen) {
        modalEl.classList.add("fullscreen");
        document.getElementById("welo-fullscreen-btn").innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        `;
      } else {
        modalEl.classList.remove("fullscreen");
        document.getElementById("welo-fullscreen-btn").innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        `;
      }
    }

    function openWeloModal() {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
      setTimeout(() => modal.classList.add("show"), 10);
    }

    function closeWeloModal() {
      modal.classList.remove("show");

      if (isFullscreen) {
        const modalEl = document.querySelector(".welo-modal");
        modalEl.classList.remove("fullscreen");
        isFullscreen = false;
      }

      document.body.style.overflow = "";
      setTimeout(() => (modal.style.display = "none"), 300);
    }

    function openWeloPage() {
      if (window.innerWidth <= 768) window.location.href = targetURL;
      else window.open(targetURL, "_blank");
    }

    // ===== Events =====
    const stopAll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    };

    dismissBtn.addEventListener("pointerdown", stopAll, true);
    dismissBtn.addEventListener(
      "click",
      (e) => {
        stopAll(e);
        collapseToCircle();
      },
      true
    );

    pill.addEventListener("click", openWeloModal);
    pill.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openWeloModal();
      }
    });

    document.getElementById("welo-close-btn").addEventListener("click", closeWeloModal);
    document.getElementById("welo-open-btn").addEventListener("click", openWeloPage);
    document.getElementById("welo-fullscreen-btn").addEventListener("click", toggleFullscreen);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeWeloModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") closeWeloModal();
    });

    // ===== Timeline =====
    tShow = setTimeout(showCircle, SHOW_CIRCLE_AFTER_MS);
    tExpand = setTimeout(expandPill, EXPAND_AFTER_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBadge);
  } else {
    initBadge();
  }
})();

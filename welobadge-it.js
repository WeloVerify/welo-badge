(function () {
  "use strict";

  // ---------- Resolve the script tag (supports multiple embeds) ----------
  const scripts = document.querySelectorAll("script[data-url]");
  const thisScript =
    (document.currentScript && document.currentScript.getAttribute
      ? document.currentScript
      : scripts[scripts.length - 1]) || null;

  if (!thisScript) return;

  const targetURL = thisScript.getAttribute("data-url") || "https://welobadge.com";
  const forcedCompany =
    thisScript.getAttribute("data-company") ||
    thisScript.getAttribute("data-company-name") ||
    "";

  // ---------- Optional config via data-* ----------
  const ALIGN = String(thisScript.getAttribute("data-align") || "left").toLowerCase(); // left | center | right

  const numOr = (v, fallback) => {
    const n = parseInt(String(v || ""), 10);
    return Number.isFinite(n) ? n : fallback;
  };

  const DESKTOP_BOTTOM = numOr(thisScript.getAttribute("data-bottom"), 20);
  const DESKTOP_SIDE = numOr(thisScript.getAttribute("data-side"), 20);
  const MOBILE_BOTTOM = numOr(thisScript.getAttribute("data-mobile-bottom"), 30);
  const MOBILE_SIDE = numOr(thisScript.getAttribute("data-mobile-side"), 18);

  const SHOW_CIRCLE_AFTER_MS = numOr(thisScript.getAttribute("data-show-ms"), 250);
  const EXPAND_AFTER_MS = numOr(thisScript.getAttribute("data-expand-ms"), 4600);

  // ---------- iOS/Safari viewport fix (100vh issues) ----------
  function setViewportUnit() {
    const h =
      (window.visualViewport && window.visualViewport.height) ||
      window.innerHeight ||
      0;
    const vh = Math.max(1, h * 0.01);
    document.documentElement.style.setProperty("--welo-vh", `${vh}px`);
  }

  // ---------- Helpers ----------
  function titleCase(str) {
    return String(str || "")
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
        .replace(/^www\./i, "")
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
    // avoid duplicates
    if (document.getElementById("welo-badge-wrap") || document.getElementById("welo-overlay")) return;

    setViewportUnit();

    const companyName =
      sanitizeCompanyName(forcedCompany || deriveCompanyName(targetURL)) || "Azienda";

    // ---------- Copy (IT) ----------
    const TITLE_TEXT = "Certificazione Welo Badge";
    const ROTATION = [
      { text: `Scopri perché ${companyName} è sicura`, duration: 4200 },
      { text: "Leggi le recensioni verificate", duration: 4200 },
      { text: "Apri il Trust Center ufficiale", duration: 4200 },
    ];

    // ---------- Wrapper + Pill ----------
    const wrap = document.createElement("div");
    wrap.id = "welo-badge-wrap";
    wrap.className = "welo-badge-wrap";

    // positioning vars
    wrap.style.setProperty("--welo-bottom", `${DESKTOP_BOTTOM}px`);
    wrap.style.setProperty("--welo-side", `${DESKTOP_SIDE}px`);
    wrap.style.setProperty("--welo-bottom-m", `${MOBILE_BOTTOM}px`);
    wrap.style.setProperty("--welo-side-m", `${MOBILE_SIDE}px`);

    if (ALIGN === "right") wrap.classList.add("welo-align-right");
    else if (ALIGN === "center") wrap.classList.add("welo-align-center");
    else wrap.classList.add("welo-align-left");

    wrap.innerHTML = `
      <div class="welo-pill" id="welo-pill" role="button" tabindex="0" aria-label="Welo Badge">
        <div class="welo-logo-container" id="welo-logo-container">
          <img
            class="welo-logo"
            src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/682461741cc0cd01187ea413_Rectangle%207089%201.png"
            alt="Logo Welo"
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

    // ---------- Modal (iframe lazy-loaded on open) ----------
    const modal = document.createElement("div");
    modal.id = "welo-overlay";
    modal.className = "welo-overlay";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="welo-modal" role="dialog" aria-modal="true" aria-label="Welo Badge">
        <div class="welo-modal-header">
          <div class="welo-header-title">
            <span class="welo-header-text">Welo Badge</span>
          </div>
          <div class="welo-header-buttons">
            <button class="welo-open-btn" id="welo-open-btn" type="button" title="Apri la Welo Page">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              <span class="welo-btn-text">Apri</span>
            </button>
            <button class="welo-fullscreen-btn" id="welo-fullscreen-btn" type="button" title="Schermo intero" aria-pressed="false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
            <button class="welo-close-btn" id="welo-close-btn" type="button" title="Chiudi">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              <span class="welo-btn-text">Chiudi</span>
            </button>
          </div>
        </div>

        <div class="welo-iframe-container">
          <iframe
            id="welo-iframe"
            data-loaded="0"
            title="Welo Page"
            style="width:100%; height:100%; border:none; font-family: 'Inter', sans-serif; display:block;"
            loading="lazy"></iframe>
        </div>
      </div>
    `;

    // ---------- Styles (single injection) ----------
    if (!document.getElementById("welo-badge-style")) {
      const style = document.createElement("style");
      style.id = "welo-badge-style";
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root{
          --welo-pill-width: 300px; /* overwritten by JS */
          --welo-stroke: #DBDBDB;
          --welo-shadow: 0px 4px 10px rgba(0,0,0,0.08);
          --welo-shadow-hover: 0px 6px 14px rgba(0,0,0,0.09);
          --welo-header-bg: #F8F8F8;
        }

        .welo-badge-wrap,
        .welo-badge-wrap *{
          box-sizing: border-box;
        }

        .welo-badge-wrap{
          position: fixed;
          bottom: var(--welo-bottom, 20px);
          left: var(--welo-side, 20px);
          z-index: 2147483000;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

          -webkit-text-size-adjust: 100%;

          opacity: 0;
          transform: translate3d(var(--welo-tx, 0px), 10px, 0);
          pointer-events: none;
          transition: opacity 260ms ease, transform 260ms ease;
        }

        .welo-badge-wrap.welo-align-left{ --welo-tx: 0px; }
        .welo-badge-wrap.welo-align-right{
          left: auto;
          right: var(--welo-side, 20px);
          --welo-tx: 0px;
        }
        .welo-badge-wrap.welo-align-center{
          left: 50%;
          right: auto;
          --welo-tx: -50%;
        }

        .welo-badge-wrap.is-visible{
          opacity: 1;
          transform: translate3d(var(--welo-tx, 0px), 0, 0);
          pointer-events: auto;
        }

        /* PILL */
        .welo-pill{
          height: 56px;
          width: 56px;
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

        .welo-pill:hover{ box-shadow: var(--welo-shadow-hover); }

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

          padding: 1px 15px 2px 0px;
        }

        .welo-badge-wrap.is-expanded .welo-text{
          opacity:1;
          transform: translateX(0);
        }

        .welo-title{
          display:block;
          font-size:16px;
          font-weight:600;
          color:#141414;
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
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
          z-index:2147483001;

          /* desktop center */
          display:none;
          align-items:center;
          justify-content:center;

          opacity:0;
          transition: opacity 0.3s ease;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overscroll-behavior: contain;
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

        /* HEADER */
        .welo-modal-header{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 15px 20px;
          border-bottom: 1px solid #eeeeee;
          background: var(--welo-header-bg);
          flex-shrink:0;
          height: 40px;
          position: relative;
          z-index: 5;
        }

        .welo-header-title{
          display:flex;
          align-items:center;
          gap: 0;
          font-size:14px;
          font-weight:600;
          color:#1a1a1a;
          margin:0;
          white-space:nowrap;
        }

        .welo-header-buttons{
          display:flex;
          align-items:center;
          gap:8px;
        }

        .welo-open-btn,
        .welo-fullscreen-btn,
        .welo-close-btn{
          display:flex;
          align-items:center;
          justify-content:center;
          background:transparent;
          color:#6b7280;
          border:none;
          border-radius:6px;
          padding:6px 10px;
          cursor:pointer;
          transition: all 0.15s ease;
          font-size:13px;
          font-weight:500;
          gap:6px;
          min-height:30px;
          line-height:1;
          -webkit-appearance:none;
          appearance:none;
        }

        .welo-open-btn{
          color:#0285FF;
          background: rgba(2, 133, 255, 0.08);
        }

        .welo-open-btn:hover{
          background: rgba(2, 133, 255, 0.12);
          transform: translateY(-1px);
        }

        .welo-fullscreen-btn:hover,
        .welo-close-btn:hover{
          background:#ededed;
          color:#1a1a1a;
        }

        .welo-open-btn svg,
        .welo-fullscreen-btn svg,
        .welo-close-btn svg{
          stroke-width:2;
          flex:0 0 auto;
        }

        .welo-btn-text{
          display:inline-block;
          white-space:nowrap;
        }

        .welo-iframe-container{
          flex:1;
          min-height:0;
          background:#fff;
          position:relative;
          z-index:1;
        }

        /* MOBILE (fix header missing on iOS Safari/Chrome) */
        @media (max-width: 768px){
  .welo-badge-wrap{
    bottom: var(--welo-bottom-m, 30px);
  }

  .welo-badge-wrap.welo-align-left{
    left: var(--welo-side-m, 18px);
    right:auto;
  }
  .welo-badge-wrap.welo-align-right{
    right: var(--welo-side-m, 18px);
    left:auto;
  }
  .welo-badge-wrap.welo-align-center{
    left:50%;
    right:auto;
  }

  .welo-pill{ height:52px; width:52px; }
  .welo-logo-container{ width:52px; height:52px; flex:0 0 52px; }
  .welo-logo{ width:26px; height:26px; }

  .welo-title{ font-size:15px; line-height:1.22; }
  .welo-subtitle{ font-size:11px; line-height:1.22; }

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

  /* ✅ keep the modal centered (no forced fullscreen) */
  .welo-overlay{
    align-items:center;
    justify-content:center;
  }

  /* ✅ modal like desktop (not 100vw/100vh) */
  .welo-modal{
    width:95%;
    max-width:1200px;
    height:90%;
    max-height:800px;
    border-radius:16px;
    transform: none;
    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
    margin:auto;
  }
  .welo-overlay.show .welo-modal{ transform:none; }

  /* safe-area + visible header (ok anche senza fullscreen) */
  .welo-modal-header{
    padding: calc(6px + env(safe-area-inset-top, 0px)) 12px 6px;
    height: calc(40px + env(safe-area-inset-top, 0px));
    background: var(--welo-header-bg);
  }

  .welo-header-title{ font-size:13px; }

  .welo-header-buttons{ gap:6px; }

  .welo-open-btn,
  .welo-fullscreen-btn,
  .welo-close-btn{
    padding:6px 8px;
    min-height:30px;
    font-size:12px;
  }

  /* fullscreen button hidden on mobile */
  .welo-fullscreen-btn{ display:none; }
}

        @media (prefers-reduced-motion: reduce){
          .welo-badge-wrap, .welo-pill, .welo-text, .welo-subtitle{ transition:none !important; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(wrap);
    document.body.appendChild(modal);

    const pill = document.getElementById("welo-pill");
    const dismissBtn = wrap.querySelector(".welo-badge-dismiss");
    const titleEl = document.getElementById("welo-dynamic-title");
    const subEl = document.getElementById("welo-dynamic-subtitle");
    const logoContainer = document.getElementById("welo-logo-container");
    const textWrap = document.getElementById("welo-text");

    const closeBtn = document.getElementById("welo-close-btn");
    const openBtn = document.getElementById("welo-open-btn");
    const fullscreenBtn = document.getElementById("welo-fullscreen-btn");
    const iframe = document.getElementById("welo-iframe");

    // ---------- Width (fast: canvas measure + cache) ----------
    const measureCache = new Map();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    function parseLetterSpacing(ls) {
      if (!ls || ls === "normal") return 0;
      const n = parseFloat(ls);
      return Number.isFinite(n) ? n : 0;
    }

    function measureTextPx(text, font, letterSpacingPx) {
      const key = `${font}||${letterSpacingPx}||${text}`;
      if (measureCache.has(key)) return measureCache.get(key);
      ctx.font = font;
      const base = ctx.measureText(text).width || 0;
      const extra =
        letterSpacingPx > 0
          ? letterSpacingPx * Math.max(0, String(text).length - 1)
          : 0;
      const w = base + extra;
      measureCache.set(key, w);
      return w;
    }

    function computePillWidth() {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const logoW = logoContainer
        ? logoContainer.getBoundingClientRect().width
        : isMobile
        ? 52
        : 56;

      const padRight = textWrap
        ? parseFloat(getComputedStyle(textWrap).paddingRight || "0")
        : isMobile
        ? 12
        : 15;

      const titleStyle = titleEl ? getComputedStyle(titleEl) : null;
      const subStyle = subEl ? getComputedStyle(subEl) : null;

      const titleFont = (titleStyle && titleStyle.font) || "600 16px Inter";
      const titleLS = parseLetterSpacing((titleStyle && titleStyle.letterSpacing) || "0px");

      const subFont = (subStyle && subStyle.font) || "400 12px Inter";
      const subLS = parseLetterSpacing((subStyle && subStyle.letterSpacing) || "0px");

      const titleW = measureTextPx(TITLE_TEXT, titleFont, titleLS);
      let subMax = 0;
      for (const s of ROTATION) subMax = Math.max(subMax, measureTextPx(s.text, subFont, subLS));

      const maxText = Math.max(titleW, subMax);

      const fudge = 10;
      let w = logoW + maxText + padRight + fudge;

      const maxAllowed = Math.min(520, window.innerWidth - 44);
      const minAllowed = 220;

      w = Math.max(minAllowed, Math.min(maxAllowed, Math.ceil(w)));
      document.documentElement.style.setProperty("--welo-pill-width", `${w}px`);
    }

    // debounced resize (also refresh vh for iOS)
    let resizeT = null;
    const onResize = () => {
      if (resizeT) clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        setViewportUnit();
        computePillWidth();
      }, 120);
    };

    computePillWidth();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onResize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        computePillWidth();
        setTimeout(computePillWidth, 150);
      });
    } else {
      setTimeout(computePillWidth, 500);
    }

    // ---------- State / timers ----------
    let userCollapsed = false;
    let tShow = null;
    let tExpand = null;
    let tRotate = null;
    let isFullscreen = false;

    let lastActiveEl = null;

    // robust iOS scroll lock
    let scrollY = 0;
    let prevBodyStyles = null;

    function lockBody() {
      scrollY = window.scrollY || window.pageYOffset || 0;
      prevBodyStyles = {
        overflow: document.body.style.overflow || "",
        position: document.body.style.position || "",
        top: document.body.style.top || "",
        width: document.body.style.width || "",
      };
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    }

    function unlockBody() {
      if (!prevBodyStyles) return;
      document.body.style.overflow = prevBodyStyles.overflow;
      document.body.style.position = prevBodyStyles.position;
      document.body.style.top = prevBodyStyles.top;
      document.body.style.width = prevBodyStyles.width;
      prevBodyStyles = null;
      window.scrollTo(0, scrollY);
    }

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

    // ---------- Modal ----------
    function setFullscreenUI(isOn) {
      const modalEl = modal.querySelector(".welo-modal");
      if (!modalEl || !fullscreenBtn) return;

      fullscreenBtn.setAttribute("aria-pressed", String(isOn));

      if (isOn) {
        modalEl.classList.add("fullscreen");
        fullscreenBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        `;
        fullscreenBtn.title = "Esci da schermo intero";
      } else {
        modalEl.classList.remove("fullscreen");
        fullscreenBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        `;
        fullscreenBtn.title = "Schermo intero";
      }
    }

    function toggleFullscreen() {
      isFullscreen = !isFullscreen;
      setFullscreenUI(isFullscreen);
    }

    function ensureIframeLoaded() {
      if (!iframe) return;
      if (iframe.getAttribute("data-loaded") === "1") return;
      iframe.src = targetURL;
      iframe.setAttribute("data-loaded", "1");
    }

    function openWeloModal() {
      setViewportUnit();
      ensureIframeLoaded();

      lastActiveEl = document.activeElement || null;

      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      lockBody();

      setTimeout(() => {
        modal.classList.add("show");
        if (closeBtn) closeBtn.focus({ preventScroll: true });
      }, 10);
    }

    function closeWeloModal() {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");

      if (isFullscreen) {
        isFullscreen = false;
        setFullscreenUI(false);
      }

      unlockBody();

      setTimeout(() => {
        modal.style.display = "none";
        if (lastActiveEl && typeof lastActiveEl.focus === "function") {
          lastActiveEl.focus({ preventScroll: true });
        }
      }, 300);
    }

    function openWeloPage() {
      if (window.innerWidth <= 768) window.location.href = targetURL;
      else window.open(targetURL, "_blank", "noopener,noreferrer");
    }

    // ---------- Events ----------
    const stopAll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    };

    if (dismissBtn) {
      dismissBtn.addEventListener("pointerdown", stopAll, true);
      dismissBtn.addEventListener(
        "click",
        (e) => {
          stopAll(e);
          collapseToCircle();
        },
        true
      );
    }

    if (pill) {
      pill.addEventListener("click", openWeloModal);
      pill.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openWeloModal();
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeWeloModal);
    if (openBtn) openBtn.addEventListener("click", openWeloPage);
    if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeWeloModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") closeWeloModal();
    });

    // ---------- Timeline ----------
    tShow = setTimeout(showCircle, SHOW_CIRCLE_AFTER_MS);
    tExpand = setTimeout(expandPill, EXPAND_AFTER_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBadge, { once: true });
  } else {
    initBadge();
  }
})();

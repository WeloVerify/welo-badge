/* Welo Trust Gap Widget (embed)
   Usage:
   <div data-welo-trustgap data-link="https://welobadge.com"></div>
   <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/trustgap.js" defer></script>
*/

(function () {
  const WIDGET_ATTR = "data-welo-trustgap";
  const DEFAULT_LINK = "https://welobadge.com";

  function boot() {
    document.querySelectorAll(`[${WIDGET_ATTR}]`).forEach((root) => {
      try {
        render(root);
        bind(root);
      } catch (e) {
        // Fail silently to avoid breaking host page
      }
    });
  }

  function render(root) {
    const link = (root.getAttribute("data-link") || DEFAULT_LINK).trim() || DEFAULT_LINK;

    // Prevent duplicate init
    if (root.__weloTrustGapMounted) return;
    root.__weloTrustGapMounted = true;

    // Clear host content
    root.innerHTML = "";

    // Build HTML (same structure as your original)
    const html = `
      <div class="wg-card">
        <div class="wg-head">
          <h3 class="wg-title">The 2026 Trust Gap: 7 signals that reduce checkout abandonment</h3>

          <p class="wg-subtitle">
            Sample: 200 leading brands (USA + Canada) across Fashion, Footwear, Beauty, Personal Care, Wellness/Supplements,
            Food & Beverage, Home, Pet, Accessories.
          </p>
        </div>

        <div class="wg-list" role="list">
          <div class="wg-row" role="listitem"
            data-title="Returns visible on PDP"
            data-result="39% do not show or link returns info directly on the PDP."
            data-checklist="Checklist: Pillar 1, Returns policy exists and is accessible"
            data-read="Practical read: Users can’t find a safety net before buying."
          >
            <div class="wg-left">
              <div class="wg-top">
                <span class="wg-pill">Pillar 1</span>
                <span class="wg-name">Returns visible on PDP</span>
              </div>
              <div class="wg-mini">Checklist: Pillar 1, Returns policy exists and is accessible</div>
            </div>

            <div class="wg-right">
              <div class="wg-metric"><span class="wg-num">39%</span><span class="wg-lbl">gap</span></div>
              <div class="wg-bar" aria-label="39% gap">
                <span class="wg-fill" style="width:39%"></span>
              </div>
            </div>
          </div>

          <div class="wg-row" role="listitem"
            data-title="Costs and fees before checkout"
            data-result="32% don’t show costs or a calculator on the PDP, 9% don’t show them even in cart."
            data-checklist="Checklist: Pillar 1, Pricing transparency before checkout"
            data-read="Practical read: Total surprises create distrust and higher abandonment."
          >
            <div class="wg-left">
              <div class="wg-top">
                <span class="wg-pill">Pillar 1</span>
                <span class="wg-name">Costs and fees before checkout</span>
              </div>
              <div class="wg-mini">Checklist: Pillar 1, Pricing transparency before checkout</div>
            </div>

            <div class="wg-right">
              <div class="wg-metric"><span class="wg-num">32%</span><span class="wg-lbl">gap</span></div>
              <div class="wg-bar" aria-label="32% gap">
                <span class="wg-fill" style="width:32%"></span>
              </div>
            </div>
          </div>

          <div class="wg-row" role="listitem"
            data-title="Concrete delivery expectations"
            data-result="38% don’t use a real delivery date, leaving expectations vague."
            data-checklist="Checklist: Pillar 1, Shipping and delivery expectations clear"
            data-read="Practical read: If timing isn’t clear, users postpone or compare elsewhere."
          >
            <div class="wg-left">
              <div class="wg-top">
                <span class="wg-pill">Pillar 1</span>
                <span class="wg-name">Concrete delivery expectations</span>
              </div>
              <div class="wg-mini">Checklist: Pillar 1, Shipping and delivery expectations clear</div>
            </div>

            <div class="wg-right">
              <div class="wg-metric"><span class="wg-num">38%</span><span class="wg-lbl">gap</span></div>
              <div class="wg-bar" aria-label="38% gap">
                <span class="wg-fill" style="width:38%"></span>
              </div>
            </div>
          </div>

          <div class="wg-row" role="listitem"
            data-title="Reviews on PDP"
            data-result="58% of PDPs have no reviews."
            data-checklist="Checklist: Pillar 2, On site reviews present"
            data-read="Practical read: Social proof is missing at the decision point."
          >
            <div class="wg-left">
              <div class="wg-top">
                <span class="wg-pill">Pillar 2</span>
                <span class="wg-name">Reviews on PDP</span>
              </div>
              <div class="wg-mini">Checklist: Pillar 2, On site reviews present</div>
            </div>

            <div class="wg-right">
              <div class="wg-metric"><span class="wg-num">58%</span><span class="wg-lbl">gap</span></div>
              <div class="wg-bar" aria-label="58% gap">
                <span class="wg-fill" style="width:58%"></span>
              </div>
            </div>
          </div>

          <div class="wg-row" role="listitem"
            data-title="Payment methods visible early and multiple"
            data-result="27% fail to offer more than one payment method."
            data-checklist="Checklist: Pillar 3, Payment methods visible early"
            data-read="Practical read: Late discovery of a missing method causes immediate drop off."
          >
            <div class="wg-left">
              <div class="wg-top">
                <span class="wg-pill">Pillar 3</span>
                <span class="wg-name">Payment methods visible early and multiple</span>
              </div>
              <div class="wg-mini">Checklist: Pillar 3, Payment methods visible early</div>
            </div>

            <div class="wg-right">
              <div class="wg-metric"><span class="wg-num">27%</span><span class="wg-lbl">gap</span></div>
              <div class="wg-bar" aria-label="27% gap">
                <span class="wg-fill" style="width:27%"></span>
              </div>
            </div>
          </div>

          <div class="wg-row" role="listitem"
            data-title="Checkout confidence near the decision"
            data-result="53% mobile and 49% desktop: checkout is mediocre or worse."
            data-checklist="Checklist: Pillar 3, Checkout confidence overall"
            data-read="Practical read: Issues close to payment, support invisible, promises not reinforced."
          >
            <div class="wg-left">
              <div class="wg-top">
                <span class="wg-pill">Pillar 3</span>
                <span class="wg-name">Checkout confidence near the decision</span>
              </div>
              <div class="wg-mini">Checklist: Pillar 3, Checkout confidence overall</div>
            </div>

            <div class="wg-right">
              <div class="wg-metric"><span class="wg-num">53%</span><span class="wg-lbl">gap</span></div>
              <div class="wg-bar" aria-label="53% gap">
                <span class="wg-fill" style="width:53%"></span>
              </div>
            </div>
          </div>

          <div class="wg-row" role="listitem"
            data-title="Mobile performance and smoothness"
            data-result="Desktop is often good (Good LCP 86%, Good CWV 76%), but mobile median Lighthouse is 55/100."
            data-checklist="Checklist: Pillar 4, Performance and UX"
            data-read="Practical read: Mobile is less optimized, perceived reliability drops, final friction increases."
          >
            <div class="wg-left">
              <div class="wg-top">
                <span class="wg-pill">Pillar 4</span>
                <span class="wg-name">Mobile performance and smoothness</span>
              </div>
              <div class="wg-mini">Checklist: Pillar 4, Performance and UX</div>
            </div>

            <div class="wg-right">
              <div class="wg-metric"><span class="wg-num">45%</span><span class="wg-lbl">gap</span></div>
              <div class="wg-bar" aria-label="45% gap">
                <span class="wg-fill" style="width:45%"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a class="wg-footerlink" href="${escapeAttr(link)}" target="_blank" rel="noopener">
        Welo Badge statistics &amp; analysis →
      </a>

      <div class="wg-tip" data-wg-tip aria-hidden="true"></div>
    `;

    // Append style + html
    const styleEl = document.createElement("style");
    styleEl.textContent = getCss();
    root.appendChild(styleEl);

    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    root.appendChild(wrap);
  }

  function bind(root) {
    const tip = root.querySelector("[data-wg-tip]");
    const rows = Array.from(root.querySelectorAll(".wg-row"));

    // Animate bars in
    rows.forEach((row) => {
      const fill = row.querySelector(".wg-fill");
      const metric = row.querySelector(".wg-num");
      if (!fill || !metric) return;

      const pct = parseInt(String(metric.textContent || "0").replace("%", ""), 10);
      fill.style.width = "0%";
      requestAnimationFrame(() => {
        fill.style.width = clamp(pct, 0, 100) + "%";
      });
    });

    function showTipForRow(row) {
      if (!tip) return;

      const title = row.getAttribute("data-title") || "";
      const result = row.getAttribute("data-result") || "";
      const checklist = row.getAttribute("data-checklist") || "";
      const read = row.getAttribute("data-read") || "";

      tip.innerHTML = `
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(result)}</p>
        <div class="wg-kv">${escapeHtml(checklist)}</div>
        <div class="wg-kv">${escapeHtml(read)}</div>
      `;

      tip.style.opacity = "1";
      tip.setAttribute("aria-hidden", "false");

      const r = row.getBoundingClientRect();
      const pad = 10;

      // move offscreen first to measure
      tip.style.transform = "translate(-9999px, -9999px)";
      const th = tip.getBoundingClientRect().height;
      const tw = tip.getBoundingClientRect().width;

      let top = r.top - th - pad;
      if (top < 12) top = r.bottom + pad;

      let left = r.left + 16;
      left = clamp(left, 12, window.innerWidth - tw - 12);

      tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    }

    function hideTip() {
      if (!tip) return;
      tip.style.opacity = "0";
      tip.setAttribute("aria-hidden", "true");
      tip.style.transform = "translate(-9999px, -9999px)";
    }

    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => showTipForRow(row));
      row.addEventListener("mousemove", () => showTipForRow(row));
      row.addEventListener("mouseleave", hideTip);
      row.addEventListener("focus", () => showTipForRow(row));
      row.addEventListener("blur", hideTip);
    });

    window.addEventListener("scroll", hideTip, { passive: true });
    window.addEventListener("resize", hideTip, { passive: true });
  }

  function getCss() {
    return `
      [data-welo-trustgap]{
        --tx:#1b1b1b;
        --mut:rgba(27,27,27,.70);
        --br:rgba(27,27,27,.14);
        --soft:rgba(27,27,27,.06);
        --shadow: 0 18px 50px rgba(0,0,0,.06);
        --fill:#1b1b1b;
        --track:rgba(27,27,27,.12);

        font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        color: var(--tx);
      }

      [data-welo-trustgap] .wg-card{
        width:100%;
        background:#fff;
        border:1px solid var(--br);
        border-radius:18px;
        box-shadow: var(--shadow);
        overflow:hidden;
      }

      [data-welo-trustgap] .wg-head{
        padding:22px;
        border-bottom:1px solid var(--br);
      }

      [data-welo-trustgap] .wg-title{
        margin:0 0 8px 0;
        font-size:18px;
        line-height:1.25;
        letter-spacing:-0.02em;
        color:var(--tx);
      }

      [data-welo-trustgap] .wg-subtitle{
        margin:0;
        font-size:13px;
        line-height:1.5;
        color:var(--mut);
      }

      [data-welo-trustgap] .wg-list{
        padding:18px 22px 22px 22px;
        display:grid;
        gap:12px;
      }

      [data-welo-trustgap] .wg-row{
        border:1px solid var(--br);
        background:rgba(255,255,255,.92);
        border-radius:14px;
        padding:14px;
        display:grid;
        grid-template-columns: 1fr 260px;
        gap:14px;
        transition: transform .08s ease, border-color .18s ease, background .18s ease;
        position:relative;
      }

      [data-welo-trustgap] .wg-row:hover{
        transform: translateY(-1px);
        border-color: rgba(27,27,27,.22);
        background:#fff;
      }

      [data-welo-trustgap] .wg-top{
        display:flex;
        align-items:center;
        gap:10px;
        flex-wrap:wrap;
        margin-bottom:6px;
      }

      [data-welo-trustgap] .wg-pill{
        display:inline-flex;
        align-items:center;
        padding:6px 10px;
        border-radius:999px;
        border:1px solid var(--br);
        background:var(--soft);
        font-size:12px;
        color:var(--tx);
        white-space:nowrap;
      }

      [data-welo-trustgap] .wg-name{
        font-size:14px;
        line-height:1.35;
        letter-spacing:-0.01em;
        color:var(--tx);
      }

      [data-welo-trustgap] .wg-mini{
        font-size:12px;
        color:var(--mut);
        line-height:1.4;
      }

      [data-welo-trustgap] .wg-right{
        display:grid;
        gap:8px;
        align-content:start;
      }

      [data-welo-trustgap] .wg-metric{
        display:flex;
        align-items:baseline;
        justify-content:flex-end;
        gap:8px;
        font-variant-numeric: tabular-nums;
      }

      [data-welo-trustgap] .wg-num{
        font-size:14px;
        font-weight:700;
        color:var(--tx);
      }

      [data-welo-trustgap] .wg-lbl{
        font-size:12px;
        color:var(--mut);
      }

      [data-welo-trustgap] .wg-bar{
        height:12px;
        border-radius:999px;
        background:var(--track);
        overflow:hidden;
      }

      [data-welo-trustgap] .wg-fill{
        display:block;
        height:100%;
        background:var(--fill);
        border-radius:999px;
        width:0%;
        transition: width .65s cubic-bezier(.2,.8,.2,1);
      }

      [data-welo-trustgap] .wg-footerlink{
        display:inline-flex;
        align-items:center;
        gap:8px;
        margin-top:12px;
        padding:10px 12px;
        border-radius:12px;
        border:1px solid var(--br);
        background:var(--soft);
        font-size:13px;
        color:var(--tx);
        text-decoration:none;
        transition: transform .08s ease, background .18s ease;
      }

      [data-welo-trustgap] .wg-footerlink:hover{
        transform: translateY(-1px);
        background: rgba(27,27,27,.08);
      }

      [data-welo-trustgap] .wg-tip{
        position: fixed;
        left: 0;
        top: 0;
        transform: translate(-9999px, -9999px);
        pointer-events: none;
        opacity: 0;
        transition: opacity .10s ease;
        background: rgba(27,27,27,.96);
        color: rgba(255,255,255,.92);
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 12px;
        padding: 12px;
        width: min(420px, calc(100vw - 36px));
        box-shadow: 0 24px 70px rgba(0,0,0,.28);
        z-index: 99999;
      }

      [data-welo-trustgap] .wg-tip strong{
        display:block;
        font-size:13px;
        margin-bottom:6px;
        color:#fff;
        letter-spacing:-0.01em;
      }

      [data-welo-trustgap] .wg-tip p{
        margin:0;
        font-size:12px;
        line-height:1.45;
        color: rgba(255,255,255,.80);
      }

      [data-welo-trustgap] .wg-tip .wg-kv{
        margin-top:8px;
        font-size:12px;
        line-height:1.35;
        color: rgba(255,255,255,.88);
      }

      @media (max-width: 760px){
        [data-welo-trustgap] .wg-row{ grid-template-columns: 1fr; }
        [data-welo-trustgap] .wg-metric{ justify-content:flex-start; }
      }
    `;
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

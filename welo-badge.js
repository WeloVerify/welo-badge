document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("welo-badge");
  if (!el) return;

  const company = el.dataset.company || "default";
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let badgeExpanded = false;

  // Style and HTML structure
  el.style.position = "fixed";
  el.style.bottom = "20px";
  el.style.left = "20px";
  el.style.height = "52px";
  el.style.minWidth = "52px";
  el.style.maxWidth = "52px";
  el.style.borderRadius = "999px";
  el.style.border = "1px solid #ddd";
  el.style.background = "#fff";
  el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  el.style.fontFamily = "'Inter', sans-serif";
  el.style.cursor = "pointer";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.overflow = "hidden";
  el.style.transition = "max-width 0.4s ease";
  el.style.zIndex = "9999";

  el.innerHTML = `
    <div id="welo-logo-container" style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:width 0.3s ease;">
      <img src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/682461741cc0cd01187ea413_Rectangle%207089%201.png" style="width:24px;height:24px;object-fit:contain;" />
    </div>
    <div id="welo-text" style="display:flex;flex-direction:column;justify-content:center;opacity:0;margin-left:0;padding-right:0;transition:opacity 0.3s ease, margin-left 0.3s ease, padding 0.3s ease;white-space:nowrap;">
      <span style="font-size:16px;font-weight:600;color:#1b1b1b;line-height:1.2;">Welo Badge</span>
      <span style="font-size:11px;font-weight:400;color:#1b1b1b;line-height:1;margin-top:3px;">Azienda Certificata</span>
    </div>
    <div id="welo-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999;align-items:center;justify-content:center;">
      <div style="position:relative;width:90%;max-width:800px;height:80%;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <button onclick="document.getElementById('welo-modal').style.display='none'; el.classList.remove('open'); badgeExpanded=false;" style="position:absolute;top:10px;right:10px;background:#000;color:#fff;border:none;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:1001;">✕</button>
        <iframe src="https://welobadge.com/welo-page/${company}" style="width:100%;height:100%;border:none;" loading="lazy"></iframe>
      </div>
    </div>
  `;

  const logoContainer = el.querySelector("#welo-logo-container");
  const textBlock = el.querySelector("#welo-text");
  const modal = el.querySelector("#welo-modal");

  function expandBadge() {
    el.classList.add("open");
    el.style.maxWidth = "200px";
    logoContainer.style.width = "38px";
    textBlock.style.opacity = "1";
    textBlock.style.marginLeft = "4px";
    textBlock.style.paddingRight = "10px";
  }

  function collapseBadge() {
    el.classList.remove("open");
    el.style.maxWidth = "52px";
    logoContainer.style.width = "52px";
    textBlock.style.opacity = "0";
    textBlock.style.marginLeft = "0";
    textBlock.style.paddingRight = "0";
  }

  if (isTouch) {
    el.addEventListener("click", function () {
      if (!badgeExpanded) {
        expandBadge();
        badgeExpanded = true;
      } else {
        modal.style.display = "flex";
      }
    });
  } else {
    el.addEventListener("mouseenter", expandBadge);
    el.addEventListener("mouseleave", collapseBadge);
    el.addEventListener("click", function () {
      modal.style.display = "flex";
    });
  }
});



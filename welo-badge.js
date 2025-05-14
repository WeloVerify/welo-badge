document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("welo-badge");
  if (!el) return;

  const company = el.dataset.company || "default";

  el.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      background:#fff;
      border:1px solid #ddd;
      border-radius:999px;
      height:52px;
      padding:0 12px;
      box-shadow:0 2px 10px rgba(0,0,0,0.1);
      font-family:'Inter',sans-serif;
      cursor:pointer;
    ">
      <img src='https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/682461741cc0cd01187ea413_Rectangle%207089%201.png' style="width:24px;height:24px;object-fit:contain;margin-right:8px;">
      <div style="display:flex;flex-direction:column;">
        <span style="font-size:16px;font-weight:600;color:#1b1b1b;">Welo Badge</span>
        <span style="font-size:11px;font-weight:400;color:#1b1b1b;">Azienda Certificata</span>
      </div>
    </div>
    <div id="welo-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999;align-items:center;justify-content:center;">
      <div style="position:relative;width:90%;max-width:800px;height:80%;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <button onclick="document.getElementById('welo-modal').style.display='none'" style="position:absolute;top:10px;right:10px;background:#000;color:#fff;border:none;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:1001;">✕</button>
        <iframe src="https://welobadge.webflow.io/welo-page/${company}" style="width:100%;height:100%;border:none;" loading="lazy"></iframe>
      </div>
    </div>
  `;

  el.onclick = function () {
    const modal = document.getElementById("welo-modal");
    modal.style.display = "flex";
  };
});

(function () {
  const scripts = document.querySelectorAll('script[data-url]');
  const thisScript = scripts[scripts.length - 1];
  const targetURL = thisScript?.getAttribute("data-url") || "https://welobadge.com";

  console.log("[Welo Badge] 📱 1-click on touch devices | 💻 hover on desktop | Full badge visible during modal");

  function initBadge() {
    // Create Badge
    const badge = document.createElement("div");
    badge.className = "welo-badge";
    badge.id = "welo-badge";
    badge.innerHTML = `
      <div class="welo-logo-container">
        <img class="welo-logo" src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/682461741cc0cd01187ea413_Rectangle%207089%201.png" alt="Welo Logo" />
      </div>
      <div class="welo-text">
        <span class="welo-title">Welo Badge</span>
        <span class="welo-subtitle">Azienda certificata</span>
      </div>
    `;

    // Create Modal
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
            <button class="welo-close-btn" id="welo-close-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="welo-loading" id="welo-loading">
          <div class="welo-spinner"></div>
          <p>Caricamento in corso...</p>
        </div>
        
        <div class="welo-iframe-container" id="welo-iframe-container">
          <iframe
            id="welo-iframe"
            src="${targetURL}"
            style="width:100%; height:100%; border:none; font-family: 'Inter', sans-serif;"
            loading="lazy">
          </iframe>
        </div>
      </div>
    `;

    // Create Styles
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      
      .welo-badge {
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e9ecef;
        border-radius: 999px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        height: 56px;
        min-width: 56px;
        max-width: 56px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9999;
        backdrop-filter: blur(10px);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .welo-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.1);
        max-width: 220px;
      }

      .welo-badge.open {
        max-width: 220px;
        transform: translateY(-1px);
      }

      .welo-logo-container {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s ease;
      }

      .welo-logo {
        width: 28px;
        height: 28px;
        object-fit: contain;
        transition: transform 0.3s ease;
      }

      .welo-badge:hover .welo-logo {
        transform: scale(1.1);
      }

      .welo-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        opacity: 0;
        margin-left: 0;
        padding-right: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        white-space: nowrap;
        transform: translateX(-10px);
      }

      .welo-badge:hover .welo-text,
      .welo-badge.open .welo-text {
        opacity: 1;
        margin-left: 4px;
        padding-right: 18px;
        transform: translateX(0);
      }

      .welo-title {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 1.2;
      }

      .welo-subtitle {
        font-size: 12px;
        font-weight: 500;
        color: #6b7280;
        line-height: 1;
        margin-top: 2px;
      }

      .welo-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(4px);
        z-index: 10000;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .welo-overlay.show {
        opacity: 1;
      }

      .welo-modal {
        position: relative;
        width: 90%;
        max-width: 900px;
        height: 85%;
        max-height: 700px;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        transform: scale(0.9) translateY(20px);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        display: flex;
        flex-direction: column;
      }

      .welo-overlay.show .welo-modal {
        transform: scale(1) translateY(0);
      }

      .welo-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 7px 40px;
        border-bottom: 1px solid #e9ecef;
        background: #f8f9fa;
      }

      .welo-modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
      }

      .welo-header-buttons {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .welo-open-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #D8EDFF;
        color: #0285FF;
        border: none;
        border-radius: 100px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .welo-open-btn:hover {
        background: #c8e5ff;
        transform: translateY(-1px);
      }

      .welo-close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        color: #6b7280;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        width: 36px;
        height: 36px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .welo-close-btn:hover {
        background: #e9ecef;
        color: #1a1a1a;
      }

      .welo-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        background: #ffffff;
      }

      .welo-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f4f6;
        border-top: 3px solid #007bff;
        border-radius: 50%;
        animation: welo-spin 1s linear infinite;
        margin-bottom: 16px;
      }

      .welo-loading p {
        margin: 0;
        color: #6b7280;
        font-size: 14px;
        font-weight: 500;
      }

      @keyframes welo-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .welo-iframe-container {
        display: none;
        flex: 1;
        background: #ffffff;
      }

      .welo-iframe-container.loaded {
        display: block;
      }

      @media (max-width: 768px) {
        .welo-badge {
          bottom: 20px;
          left: 20px;
          height: 52px;
          min-width: 52px;
          max-width: 52px;
        }

        .welo-badge:hover,
        .welo-badge.open {
          max-width: 180px;
        }

        .welo-logo-container {
          width: 52px;
          height: 52px;
        }

        .welo-logo {
          width: 26px;
          height: 26px;
        }

        .welo-title {
          font-size: 14px;
        }

        .welo-subtitle {
          font-size: 11px;
        }

        .welo-modal {
          width: 90%;
          height: 80%;
          max-height: 600px;
          border-radius: 12px;
          margin: 20px;
        }

        .welo-modal-header {
          padding: 16px 20px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .welo-modal-header h3 {
          font-size: 16px;
        }

        .welo-header-buttons {
          gap: 8px;
        }

        .welo-open-btn {
          padding: 8px 12px;
          font-size: 13px;
          gap: 6px;
          border-radius: 20px;
        }

        .welo-btn-text {
          display: none;
        }

        .welo-close-btn {
          width: 32px;
          height: 32px;
        }

        .welo-close-btn svg {
          width: 14px;
          height: 14px;
        }

        .welo-loading p {
          font-size: 13px;
        }
      }

      @media (max-width: 1024px) and (min-width: 769px) {
        .welo-modal {
          width: 95%;
          height: 90%;
        }

        .welo-modal-header {
          padding: 18px 22px;
        }
      }

      @media (hover: none) and (pointer: coarse) {
        .welo-badge:hover {
          transform: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .welo-badge:active {
          transform: scale(0.95);
        }

        .welo-open-btn:hover,
        .welo-close-btn:hover {
          transform: none;
        }

        .welo-open-btn:active {
          transform: scale(0.95);
        }

        .welo-close-btn:active {
          transform: scale(0.95);
        }
      }

      @media (max-width: 480px) {
        .welo-badge {
          bottom: 16px;
          left: 16px;
        }

        .welo-modal {
          width: 95%;
          height: 90%;
          border-radius: 8px;
          margin: 10px;
        }

        .welo-modal-header {
          padding: 12px 16px;
        }

        .welo-modal-header h3 {
          font-size: 15px;
        }

        .welo-open-btn {
          padding: 6px 10px;
          font-size: 12px;
        }

        .welo-close-btn {
          width: 30px;
          height: 30px;
        }
      }

      @media (max-height: 500px) and (orientation: landscape) {
        .welo-modal {
          height: 95%;
          width: 90%;
        }

        .welo-modal-header {
          padding: 12px 20px;
        }
      }
    `;

    // Append elements to DOM
    document.head.appendChild(style);
    document.body.appendChild(badge);
    document.body.appendChild(modal);

    // Initialize variables
    let isLoaded = false;
    let isMobile = window.innerWidth <= 768;

    // Detect mobile device
    function detectMobile() {
      isMobile = window.innerWidth <= 768;
    }

    // Handle window resize
    window.addEventListener('resize', detectMobile);

    // Modal functions
    function openWeloModal() {
      modal.style.display = 'flex';
      badge.classList.add('open');
      
      // Prevent body scroll on mobile
      document.body.style.overflow = 'hidden';
      
      // Push state for back button handling on mobile
      if (isMobile) {
        history.pushState({modalOpen: true}, '', '');
      }
      
      // Trigger animation
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      
      // Show loading initially
      document.getElementById('welo-loading').style.display = 'flex';
      document.getElementById('welo-iframe-container').style.display = 'none';
      
      // Handle iframe loading
      if (!isLoaded) {
        const iframe = document.getElementById('welo-iframe');
        iframe.onload = function() {
          setTimeout(() => {
            document.getElementById('welo-loading').style.display = 'none';
            const container = document.getElementById('welo-iframe-container');
            container.style.display = 'block';
            container.classList.add('loaded');
            isLoaded = true;
          }, 800);
        };
        
        // Fallback timeout
        setTimeout(() => {
          if (!isLoaded) {
            document.getElementById('welo-loading').style.display = 'none';
            const container = document.getElementById('welo-iframe-container');
            container.style.display = 'block';
            container.classList.add('loaded');
            isLoaded = true;
          }
        }, 5000);
      } else {
        // Already loaded, show iframe immediately
        setTimeout(() => {
          document.getElementById('welo-loading').style.display = 'none';
          document.getElementById('welo-iframe-container').style.display = 'block';
        }, 300);
      }
    }

    function closeWeloModal() {
      modal.classList.remove('show');
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      setTimeout(() => {
        modal.style.display = 'none';
        badge.classList.remove('open');
      }, 300);
    }

    function openWeloPage() {
      if (isMobile) {
        // On mobile, open in same tab to avoid popup blockers
        window.location.href = targetURL;
      } else {
        // On desktop, open in new tab
        window.open(targetURL, '_blank');
      }
    }

    // Event listeners
    badge.addEventListener('click', (e) => {
      e.preventDefault();
      openWeloModal();
    });

    // Touch events for better mobile experience
    badge.addEventListener('touchstart', (e) => {
      e.preventDefault();
      badge.style.transform = 'scale(0.95)';
    });

    badge.addEventListener('touchend', (e) => {
      e.preventDefault();
      badge.style.transform = '';
      openWeloModal();
    });

    // Modal event listeners
    document.getElementById('welo-close-btn').addEventListener('click', closeWeloModal);
    document.getElementById('welo-open-btn').addEventListener('click', openWeloPage);

    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeWeloModal();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeWeloModal();
      }
    });

    // Handle back button on mobile
    window.addEventListener('popstate', () => {
      if (modal.style.display === 'flex') {
        closeWeloModal();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBadge);
  } else {
    initBadge();
  }
})();

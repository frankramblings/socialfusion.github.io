(function() {
  // Check if already injected
  if (document.getElementById('tc-mobile-styles')) {
    console.log('TC Mobile already injected');
    return;
  }

  // Create styles
  const style = document.createElement('style');
  style.id = 'tc-mobile-styles';
  style.textContent = `
    body {
      font-family: 'Open Sans', sans-serif !important;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Improve header */
    .toolbar {
      background-color: white !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
      height: 56px;
    }
    
    /* Improve navigation */
    .primary-nav {
      background-color: white !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }
    
    .primary-nav-link {
      padding: 12px 16px !important;
      border-radius: 8px !important;
      margin: 4px !important;
    }
    
    /* Improve card-like appearance for content */
    .card, .modal-content {
      border-radius: 8px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      margin-bottom: 16px !important;
      overflow: hidden !important;
    }
    
    /* Improve buttons */
    .btn {
      border-radius: 8px !important;
      padding: 8px 16px !important;
      font-weight: 500 !important;
    }
    
    /* Make images responsive */
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    /* Improve typography */
    h1, h2, h3, h4, h5, h6 {
      font-weight: 600 !important;
      line-height: 1.3 !important;
    }
    
    /* Add padding to content */
    .container {
      padding: 16px !important;
    }
    
    /* Improve form inputs */
    input, select, textarea {
      border-radius: 8px !important;
      padding: 10px 12px !important;
    }
    
    /* Transparent Classroom specific improvements */
    .dashboard-page {
      background-color: #f7fafc !important;
    }
    
    .primary-nav-link.active {
      background-color: rgba(107, 142, 80, 0.1) !important;
      color: #6b8e50 !important;
    }
    
    .btn-primary {
      background-color: #6b8e50 !important;
      border-color: #6b8e50 !important;
    }
    
    /* Responsive improvements */
    @media (max-width: 768px) {
      .container {
        width: 100% !important;
        padding: 12px !important;
      }
      
      .row {
        margin-left: -8px !important;
        margin-right: -8px !important;
      }
      
      [class*="col-"] {
        padding-left: 8px !important;
        padding-right: 8px !important;
      }
      
      .hidden-xs {
        display: none !important;
      }
    }
    
    /* Touch friendly improvements */
    a, button, .btn, .nav-link {
      min-height: 44px !important;
      min-width: 44px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    /* Mobile-friendly tables */
    .table-responsive {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      margin-bottom: 16px !important;
    }
    
    /* Better touch scrolling */
    div, main, section {
      -webkit-overflow-scrolling: touch !important;
    }
  `;
  
  document.head.appendChild(style);
  
  // Add meta viewport if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    document.head.appendChild(viewport);
  }
  
  // Load Material Icons if not present
  if (!document.querySelector('link[href*="Material+Icons"]')) {
    const iconFont = document.createElement('link');
    iconFont.rel = 'stylesheet';
    iconFont.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(iconFont);
  }
  
  // Add notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #6b8e50;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  `;
  notification.textContent = 'TC Mobile Enhancement Active';
  document.body.appendChild(notification);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
  
  console.log('TC Mobile Enhancement active');
})();

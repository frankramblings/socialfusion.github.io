// ==UserScript==
// @name         Transparent Classroom Mobile Skin
// @namespace    https://transparentclassroom.com
// @version      1.0
// @description  A mobile-friendly interface for Transparent Classroom
// @author       You
// @match        https://*.transparentclassroom.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
  'use strict';
  
  let skinEnabled = true;
  let mobileApp = null;
  let originalContent = null;
  let currentTheme = 'system';
  
  // Initialize on load
  init();
  
  function init() {
    // Load saved preferences
    try {
      if (typeof GM_getValue === 'function') {
        // User script environment
        skinEnabled = GM_getValue('skinEnabled', true);
        currentTheme = GM_getValue('theme', 'system');
      } else {
        // Check local storage as fallback
        const savedEnabled = localStorage.getItem('tc_mobile_enabled');
        if (savedEnabled !== null) {
          skinEnabled = savedEnabled === 'true';
        }
        
        const savedTheme = localStorage.getItem('tc_mobile_theme');
        if (savedTheme) {
          currentTheme = savedTheme;
        }
      }
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  
    // Create floating control button for mobile
    createControlButton();
    
    if (skinEnabled) {
      applySkin();
    }
  }
  
  function createControlButton() {
    const controlBtn = document.createElement('button');
    controlBtn.id = 'tc-mobile-control';
    controlBtn.innerText = skinEnabled ? 'Disable Mobile View' : 'Enable Mobile View';
    controlBtn.style.position = 'fixed';
    controlBtn.style.bottom = '20px';
    controlBtn.style.right = '20px';
    controlBtn.style.zIndex = '9999';
    controlBtn.style.padding = '10px';
    controlBtn.style.borderRadius = '50px';
    controlBtn.style.backgroundColor = '#4a6da7';
    controlBtn.style.color = 'white';
    controlBtn.style.border = 'none';
    controlBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    controlBtn.style.fontSize = '14px';
    
    controlBtn.addEventListener('click', function() {
      toggleSkin();
      this.innerText = skinEnabled ? 'Disable Mobile View' : 'Enable Mobile View';
    });
    
    // Long press to toggle theme (useful for mobile)
    let pressTimer;
    controlBtn.addEventListener('touchstart', function() {
      pressTimer = setTimeout(function() {
        cycleTheme();
      }, 1000);
    });
    
    controlBtn.addEventListener('touchend', function() {
      clearTimeout(pressTimer);
    });
    
    document.body.appendChild(controlBtn);
  }
  
  function toggleSkin() {
    skinEnabled = !skinEnabled;
    
    // Save preference
    savePreference('skinEnabled', skinEnabled);
    
    if (skinEnabled) {
      applySkin();
    } else {
      removeSkin();
    }
  }
  
  function cycleTheme() {
    // Cycle through themes: light -> dark -> system -> light
    if (currentTheme === 'light') {
      currentTheme = 'dark';
    } else if (currentTheme === 'dark') {
      currentTheme = 'system';
    } else {
      currentTheme = 'light';
    }
    
    // Save preference
    savePreference('theme', currentTheme);
    
    // Apply theme if skin is enabled
    if (skinEnabled && mobileApp) {
      updateTheme();
      alert('Theme changed to: ' + currentTheme);
    }
  }
  
  function savePreference(key, value) {
    try {
      if (typeof GM_setValue === 'function') {
        // User script environment
        GM_setValue(key, value);
      } else {
        // Use local storage as fallback
        localStorage.setItem('tc_mobile_' + key, value);
      }
    } catch (e) {
      console.error('Error saving preference:', e);
    }
  }
  
  function applySkin() {
    // Only apply if not already applied
    if (mobileApp) return;
    
    // Store original page content for later restoration
    originalContent = document.body.innerHTML;
    
    // Create container for our mobile app
    mobileApp = document.createElement('div');
    mobileApp.id = 'tc-mobile-skin';
    mobileApp.style.position = 'fixed';
    mobileApp.style.top = '0';
    mobileApp.style.left = '0';
    mobileApp.style.width = '100%';
    mobileApp.style.height = '100%';
    mobileApp.style.zIndex = '9999';
    mobileApp.style.backgroundColor = 'var(--background, #ffffff)';
    mobileApp.style.overflow = 'auto';
    mobileApp.style.webkitOverflowScrolling = 'touch';
    
    // Create the UI structure
    createMobileUI(mobileApp);
    
    // Replace body content with our app
    document.body.appendChild(mobileApp);
    
    // Hide original content but keep it in DOM for data extraction
    const originalContentContainer = document.createElement('div');
    originalContentContainer.id = 'tc-original-content';
    originalContentContainer.style.display = 'none';
    
    // Move all body children (except our app and control button) to the hidden container
    Array.from(document.body.children).forEach(child => {
      if (child !== mobileApp && child.id !== 'tc-mobile-control') {
        originalContentContainer.appendChild(child);
      }
    });
    
    document.body.appendChild(originalContentContainer);
    
    // Make sure our control button stays on top
    const controlBtn = document.getElementById('tc-mobile-control');
    if (controlBtn) {
      document.body.appendChild(controlBtn);
      controlBtn.style.zIndex = '10000';
    }
    
    // Add proper viewport meta tag for mobile if it doesn't exist
    if (!document.querySelector('meta[name="viewport"]')) {
      const metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(metaViewport);
    }
    
    // Apply the current theme
    updateTheme();
    
    // Extract data from original page
    extractAndProcessData();
  }
  
  function removeSkin() {
    if (!mobileApp) return;
    
    // Remove our mobile skin
    mobileApp.remove();
    mobileApp = null;
    
    // Restore original content
    const originalContentContainer = document.getElementById('tc-original-content');
    if (originalContentContainer) {
      // Move all children back to body
      while (originalContentContainer.firstChild) {
        document.body.appendChild(originalContentContainer.firstChild);
      }
      originalContentContainer.remove();
    }
    
    // Make sure our control button stays on top
    const controlBtn = document.getElementById('tc-mobile-control');
    if (controlBtn) {
      document.body.appendChild(controlBtn);
    }
  }
  
  function updateTheme() {
    if (!mobileApp) return;
    
    // Remove any existing theme classes
    mobileApp.classList.remove('theme-light', 'theme-dark');
    
    if (currentTheme === 'light') {
      mobileApp.classList.add('theme-light');
    } else if (currentTheme === 'dark') {
      mobileApp.classList.add('theme-dark');
    } else {
      // System theme - detect from browser
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        mobileApp.classList.add('theme-dark');
      } else {
        mobileApp.classList.add('theme-light');
      }
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (currentTheme === 'system' && mobileApp) {
          mobileApp.classList.remove('theme-light', 'theme-dark');
          mobileApp.classList.add(event.matches ? 'theme-dark' : 'theme-light');
        }
      });
    }
  }
  
  function createMobileUI(container) {
    // Create side menu
    const sideMenu = document.createElement('div');
    sideMenu.className = 'side-menu';
    
    // Menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    
    // Menu header
    const menuHeader = document.createElement('div');
    menuHeader.className = 'menu-header';
    
    const schoolName = document.createElement('div');
    schoolName.className = 'school-name';
    schoolName.textContent = 'Little Tree Education';
    
    const schoolLocation = document.createElement('div');
    schoolLocation.className = 'school-location';
    schoolLocation.textContent = 'Newmarket';
    
    menuHeader.appendChild(schoolName);
    menuHeader.appendChild(schoolLocation);
    
    // Menu items
    const menuItems = document.createElement('div');
    menuItems.className = 'menu-items';
    
    const menuLinks = [
      { icon: 'home-icon', text: 'Home', active: true },
      { icon: 'child-icon', text: 'Cecilia (Cece)' },
      { icon: 'class-icon', text: 'Classmates' },
      { icon: 'directory-icon', text: 'Directory' },
      { icon: 'info-icon', text: 'About' }
    ];
    
    menuLinks.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = `menu-item ${item.active ? 'active' : ''}`;
      
      const icon = document.createElement('div');
      icon.className = `menu-icon ${item.icon}`;
      
      const text = document.createElement('div');
      text.textContent = item.text;
      
      menuItem.appendChild(icon);
      menuItem.appendChild(text);
      menuItems.appendChild(menuItem);
    });
    
    // Menu footer
    const menuFooter = document.createElement('div');
    menuFooter.className = 'menu-footer';
    
    const userAvatar = document.createElement('div');
    userAvatar.className = 'user-avatar';
    userAvatar.textContent = 'FE';
    
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    
    const userName = document.createElement('div');
    userName.className = 'user-name';
    userName.textContent = 'Frank Emanuele';
    
    const logoutLink = document.createElement('div');
    logoutLink.className = 'logout-link';
    logoutLink.textContent = 'Logout';
    
    userInfo.appendChild(userName);
    userInfo.appendChild(logoutLink);
    
    menuFooter.appendChild(userAvatar);
    menuFooter.appendChild(userInfo);
    
    // Add all menu parts
    sideMenu.appendChild(menuHeader);
    sideMenu.appendChild(menuItems);
    sideMenu.appendChild(menuFooter);
    
    container.appendChild(menuOverlay);
    container.appendChild(sideMenu);
    
    // Create header
    const header = document.createElement('div');
    header.className = 'tc-mobile-header';
    
    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    
    // Menu button
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    const menuIcon = document.createElement('span');
    menuIcon.className = 'menu-icon';
    menuButton.appendChild(menuIcon);
    
    // Brand
    const brand = document.createElement('div');
    brand.className = 'brand';
    brand.textContent = 'LT';
    
    // User avatar in header
    const headerAvatar = document.createElement('div');
    headerAvatar.className = 'user-avatar';
    headerAvatar.textContent = 'FE';
    
    headerContent.appendChild(menuButton);
    headerContent.appendChild(brand);
    headerContent.appendChild(headerAvatar);
    header.appendChild(headerContent);
    container.appendChild(header);
    
    // Child selector
    const childSelectContainer = document.createElement('div');
    childSelectContainer.className = 'child-select-container';
    
    const childSelectButton = document.createElement('button');
    childSelectButton.className = 'child-select-button';
    childSelectButton.textContent = 'Cecilia (Cece)';
    childSelectButton.id = 'child-select';
    
    childSelectContainer.appendChild(childSelectButton);
    container.appendChild(childSelectContainer);
    
    // Create main content area
    const main = document.createElement('div');
    main.className = 'tc-mobile-main';
    
    const dateFilter = document.createElement('div');
    dateFilter.className = 'date-filter';
    
    const dateButton = document.createElement('button');
    dateButton.className = 'date-button';
    dateButton.textContent = 'Filter by date';
    
    dateFilter.appendChild(dateButton);
    
    const activitiesContainer = document.createElement('div');
    activitiesContainer.id = 'activities-container';
    activitiesContainer.className = 'activities-container';
    
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Loading activities...';
    
    activitiesContainer.appendChild(loading);
    
    main.appendChild(dateFilter);
    main.appendChild(activitiesContainer);
    container.appendChild(main);
    
    // Create bottom navigation
    const bottomNav = document.createElement('div');
    bottomNav.className = 'tc-mobile-bottom-nav';
    
    const navItems = [
      { icon: 'home-icon', label: 'Home', active: true },
      { icon: 'child-icon', label: 'Child' },
      { icon: 'class-icon', label: 'Class' },
      { icon: 'directory-icon', label: 'Directory' }
    ];
    
    navItems.forEach(item => {
      const navItem = document.createElement('div');
      navItem.className = 'nav-item' + (item.active ? ' active' : '');
      
      const navIcon = document.createElement('span');
      navIcon.className = 'nav-icon ' + item.icon;
      
      const navLabel = document.createElement('span');
      navLabel.className = 'nav-label';
      navLabel.textContent = item.label;
      
      navItem.appendChild(navIcon);
      navItem.appendChild(navLabel);
      bottomNav.appendChild(navItem);
    });
    
    container.appendChild(bottomNav);
    
    // Add styles
    addStyles();
    
    // Add event listeners
    setupEventListeners();
  }
  
  function addStyles() {
    const style = document.createElement('style');
    style.id = 'tc-mobile-skin-styles';
    style.textContent = `
      /* Reset */
      #tc-mobile-skin * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      
      /* Light Theme (Default) - Modern, elegant design */
      #tc-mobile-skin {
        --background: #f8f9fa;
        --foreground: #1a1a1a;
        --muted-foreground: #717171;
        --primary: #4f9a94;
        --primary-foreground: #ffffff;
        --secondary: #f1f3f5;
        --secondary-foreground: #1a1a1a;
        --border: #e4e8ec;
        --card: #ffffff;
        --card-foreground: #1a1a1a;
        --card-border: #f0f2f5;
        --accent: #e6f2f1;
        --accent-foreground: #3b7671;
        --avatar-bg: #f0f2f5;
        --avatar-text: #4f9a94;
        --transparent-white: rgba(255, 255, 255, 0.95);
        --highlight: #f27474;
        --success: #4caf50;
        --info: #2196f3;
        --radius: 12px;
        --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
        --shadow-md: 0 2px 8px rgba(0,0,0,0.07);
        --shadow-lg: 0 4px 16px rgba(0,0,0,0.08);
        --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      /* Dark Theme - Elegant, reduced eye strain */
      #tc-mobile-skin.theme-dark {
        --background: #111827;
        --foreground: #f3f4f6;
        --muted-foreground: #9ca3af;
        --primary: #5bb5ac;
        --primary-foreground: #ffffff;
        --secondary: #1f2937;
        --secondary-foreground: #f3f4f6;
        --border: #374151;
        --card: #1f2937;
        --card-foreground: #f3f4f6;
        --card-border: #2c3a4e;
        --accent: #1a3330;
        --accent-foreground: #5bb5ac;
        --avatar-bg: #2c3a4e;
        --avatar-text: #9ca3af;
        --transparent-white: rgba(17, 24, 39, 0.95);
        --highlight: #ef4444;
        --success: #10b981;
        --info: #3b82f6;
      }
      
      #tc-mobile-skin, 
      #tc-mobile-skin.theme-light {
        background-color: var(--background);
        color: var(--foreground);
      }
      
      /* Header - modern elegant design */
      .tc-mobile-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background-color: var(--card);
        color: var(--foreground);
        z-index: 10;
        border-bottom: 1px solid var(--border);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        background-color: rgba(255, 255, 255, 0.85);
        box-shadow: var(--shadow-sm);
        padding-top: env(safe-area-inset-top, 0);
        height: calc(60px + env(safe-area-inset-top, 0));
      }
      
      .theme-dark .tc-mobile-header {
        background-color: rgba(31, 41, 55, 0.85);
      }
      
      .header-content {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 16px;
      }
      
      .menu-button {
        background: none;
        border: none;
        width: 32px;
        height: 32px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--foreground);
      }
      
      .menu-icon {
        width: 20px;
        height: 2px;
        background-color: var(--foreground);
        position: relative;
      }
      
      .menu-icon:before,
      .menu-icon:after {
        content: '';
        position: absolute;
        width: 20px;
        height: 2px;
        background-color: var(--foreground);
        left: 0;
      }
      
      .menu-icon:before {
        top: -6px;
      }
      
      .menu-icon:after {
        bottom: -6px;
      }
      
      .tc-mobile-header .brand {
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
      }
      
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: var(--secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--foreground);
        font-size: 14px;
        font-weight: 600;
      }
      
      /* Child Selector */
      .child-select-container {
        width: 100%;
        padding: 0 16px;
        margin-top: 60px;  /* Space for header */
      }
      
      .child-select-button {
        width: 100%;
        padding: 10px 16px;
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 12px 0;
        cursor: pointer;
      }
      
      .child-select-button:after {
        content: '';
        width: 10px;
        height: 10px;
        border-right: 2px solid var(--primary-foreground);
        border-bottom: 2px solid var(--primary-foreground);
        transform: rotate(45deg);
        margin-right: 6px;
      }
      
      /* Main content */
      .tc-mobile-main {
        padding: 120px 16px 80px; /* More padding at top for child selector */
        min-height: 100vh;
        background-color: var(--background);
        position: relative;
        z-index: 1;
      }
      
      #tc-mobile-skin {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .date-filter {
        display: flex;
        margin-bottom: 20px;
        width: 100%;
      }
      
      .date-button {
        background-color: var(--card);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 10px 16px;
        font-size: 15px;
        color: var(--foreground);
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 100%;
      }
      
      .date-button:before {
        content: '';
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 8px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .save-all-button {
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 14px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      
      .save-all-button:before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'%3E%3C/path%3E%3Cpolyline points='7 10 12 15 17 10'%3E%3C/polyline%3E%3Cline x1='12' y1='15' x2='12' y2='3'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      /* Activity cards - elegant, modern design */
      .activity-card {
        background-color: var(--card);
        border-radius: var(--radius);
        box-shadow: var(--shadow-md);
        margin-bottom: 20px;
        overflow: hidden;
        border: 1px solid var(--border);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      .activity-card:active {
        transform: translateY(1px);
        box-shadow: var(--shadow-sm);
      }
      
      .activity-image-container {
        width: 100%;
        position: relative;
      }
      
      .activity-image {
        width: 100%;
        display: block;
      }
      
      .image-actions {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 10px;
      }
      
      .image-action-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: var(--transparent-white);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      
      .action-menu {
        position: absolute;
        top: 50px;
        right: 10px;
        background-color: var(--card);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
        z-index: 20;
        display: none;
      }
      
      .action-menu.visible {
        display: block;
      }
      
      .action-menu-item {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }
      
      .action-menu-item:hover {
        background-color: var(--accent);
      }
      
      .activity-content {
        padding: 16px;
      }
      
      .activity-header {
        margin-bottom: 8px;
      }
      
      .activity-classroom {
        font-weight: 600;
        color: var(--card-foreground);
        font-size: 16px;
        margin-bottom: 2px;
        display: inline-block;
      }
      
      .activity-date {
        color: var(--muted-foreground);
        font-size: 14px;
        margin-left: 8px;
      }
      
      .activity-text {
        font-size: 15px;
        line-height: 1.5;
        margin: 12px 0;
        color: var(--card-foreground);
      }
      
      .activity-text .highlight {
        color: var(--highlight);
        font-weight: 500;
      }
      
      /* Comments section */
      .comment-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }
      
      .comment {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
      }
      
      .comment-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: var(--avatar-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--avatar-text);
        font-size: 14px;
        font-weight: 500;
        flex-shrink: 0;
      }
      
      .comment-content {
        flex: 1;
      }
      
      .comment-author {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 2px;
      }
      
      .comment-time {
        color: var(--muted-foreground);
        font-size: 12px;
        margin-left: 6px;
        font-weight: normal;
      }
      
      .comment-text {
        font-size: 14px;
        line-height: 1.4;
      }
      
      /* Child selection page */
      .child-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 0 16px;
        margin-top: 80px;
      }
      
      .child-item {
        background-color: var(--card);
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        border: 1px solid var(--border);
      }
      
      .child-item:active {
        background-color: var(--accent);
      }
      
      .child-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--avatar-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--avatar-text);
        font-size: 14px;
        font-weight: 500;
      }
      
      .child-info {
        flex: 1;
      }
      
      .child-name {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 2px;
      }
      
      .child-classroom {
        color: var(--muted-foreground);
        font-size: 14px;
      }
      
      /* Directory page */
      .directory-search {
        padding: 16px;
        margin-top: 60px;
      }
      
      .search-input {
        width: 100%;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background-color: var(--card);
        font-size: 15px;
        margin-bottom: 16px;
      }
      
      .contact-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 0 16px 80px;
      }
      
      .contact-card {
        background-color: var(--card);
        border-radius: 8px;
        padding: 16px;
        display: flex;
        gap: 16px;
        border: 1px solid var(--border);
      }
      
      .contact-photo {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .contact-info {
        flex: 1;
      }
      
      .contact-name {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
      }
      
      .contact-role {
        color: var(--muted-foreground);
        font-size: 14px;
        margin-bottom: 8px;
      }
      
      .contact-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      
      .contact-action {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-foreground);
        cursor: pointer;
      }
      
      /* Side menu */
      .side-menu {
        position: fixed;
        top: 0;
        left: -280px;
        width: 280px;
        height: 100%;
        background-color: var(--card);
        z-index: 1000;
        transition: left 0.3s ease;
        box-shadow: 2px 0 8px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
      }
      
      .side-menu.open {
        left: 0;
      }
      
      .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .menu-overlay.visible {
        opacity: 1;
        pointer-events: auto;
      }
      
      .menu-header {
        padding: 16px 20px;
        background-color: var(--primary);
        color: var(--primary-foreground);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .school-name {
        font-weight: 600;
        font-size: 18px;
      }
      
      .school-location {
        font-size: 14px;
        opacity: 0.8;
      }
      
      .menu-items {
        flex: 1;
        padding: 16px 0;
        display: flex;
        flex-direction: column;
      }
      
      .menu-item {
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        color: var(--foreground);
        font-size: 16px;
        cursor: pointer;
      }
      
      .menu-item:hover, .menu-item.active {
        background-color: var(--accent);
      }
      
      .menu-icon {
        width: 20px;
        height: 20px;
        opacity: 0.85;
      }
      
      .menu-footer {
        padding: 16px 20px;
        border-top: 1px solid var(--border);
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .user-info {
        display: flex;
        flex-direction: column;
      }
      
      .user-name {
        font-weight: 500;
        font-size: 15px;
      }
      
      .logout-link {
        color: var(--primary);
        font-size: 14px;
      }
      
      /* Bottom Navigation - Modern, iOS-like style */
      .tc-mobile-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background-color: var(--card);
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top: 1px solid var(--border);
        z-index: 10;
        padding-bottom: env(safe-area-inset-bottom, 0);
        height: calc(60px + env(safe-area-inset-bottom, 0));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        background-color: rgba(255, 255, 255, 0.85);
        box-shadow: var(--shadow-sm);
      }
      
      .theme-dark .tc-mobile-bottom-nav {
        background-color: rgba(31, 41, 55, 0.85);
      }
      
      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex: 1;
        cursor: pointer;
      }
      
      .nav-icon {
        width: 24px;
        height: 24px;
        margin-bottom: 4px;
        opacity: 0.6;
      }
      
      .nav-label {
        font-size: 12px;
        color: var(--muted-foreground);
      }
      
      .nav-item.active .nav-icon {
        opacity: 1;
      }
      
      .nav-item.active .nav-label {
        color: var(--primary);
        font-weight: 500;
      }
      
      .home-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'%3E%3C/path%3E%3Cpolyline points='9 22 9 12 15 12 15 22'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .child-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .class-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='9' cy='7' r='4'%3E%3C/circle%3E%3Cpath d='M23 21v-2a4 4 0 0 0-3-3.87'%3E%3C/path%3E%3Cpath d='M16 3.13a4 4 0 0 1 0 7.75'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .directory-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .info-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='16' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .download-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'%3E%3C/path%3E%3Cpolyline points='7 10 12 15 17 10'%3E%3C/polyline%3E%3Cline x1='12' y1='15' x2='12' y2='3'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .calendar-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .share-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'%3E%3C/path%3E%3Cpolyline points='16 6 12 2 8 6'%3E%3C/polyline%3E%3Cline x1='12' y1='2' x2='12' y2='15'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .more-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='1'%3E%3C/circle%3E%3Ccircle cx='19' cy='12' r='1'%3E%3C/circle%3E%3Ccircle cx='5' cy='12' r='1'%3E%3C/circle%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .settings-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .logout-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'%3E%3C/path%3E%3Cpolyline points='16 17 21 12 16 7'%3E%3C/polyline%3E%3Cline x1='21' y1='12' x2='9' y2='12'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      /* Loading states */
      .loading {
        text-align: center;
        padding: 40px 20px;
        color: var(--muted-foreground);
      }
      
      .loading:after {
        content: '';
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid var(--primary);
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        margin: 20px auto 0;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .no-activities {
        text-align: center;
        padding: 40px 20px;
        color: var(--muted-foreground);
      }
      
      .error {
        text-align: center;
        padding: 20px;
        color: #e74c3c;
      }
      
      /* Make Safari mobile-friendly */
      @supports (-webkit-touch-callout: none) {
        /* Safari iOS specific styles */
        .tc-mobile-main {
          -webkit-overflow-scrolling: touch;
        }
        
        select, input, button {
          font-size: 16px !important; /* Prevents zoom on focus */
        }
        
        .tc-mobile-bottom-nav {
          padding-bottom: env(safe-area-inset-bottom, 0);
          height: calc(60px + env(safe-area-inset-bottom, 0));
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  function setupEventListeners() {
    // Menu button - toggle side menu
    const menuButton = document.querySelector('.menu-button');
    const sideMenu = document.querySelector('.side-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (menuButton && sideMenu && menuOverlay) {
      menuButton.addEventListener('click', function() {
        // Toggle side menu
        sideMenu.classList.add('open');
        menuOverlay.classList.add('visible');
      });
      
      // Close menu when clicking overlay
      menuOverlay.addEventListener('click', function() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('visible');
      });
      
      // Menu items
      document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
          // Remove active from all items
          document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
          // Add active to clicked item
          item.classList.add('active');
          // Close menu
          sideMenu.classList.remove('open');
          menuOverlay.classList.remove('visible');
        });
      });
    }
    
    // Child selector button
    const childSelectButton = document.getElementById('child-select');
    if (childSelectButton) {
      childSelectButton.addEventListener('click', function() {
        // Show child selection page (to be implemented)
        alert('Child selection coming soon!');
      });
    }
    
    // Date button - show date picker
    const dateButton = document.querySelector('.date-button');
    if (dateButton) {
      dateButton.addEventListener('click', function() {
        // Show date picker (to be implemented)
        alert('Date picker coming soon!');
      });
    }
    
    // Save all button - download all images
    const saveAllButton = document.querySelector('.save-all-button');
    if (saveAllButton) {
      saveAllButton.addEventListener('click', function() {
        // Save all images functionality
        const images = document.querySelectorAll('.activity-image');
        if (images.length === 0) {
          alert('No images found to download');
          return;
        }
        
        alert('Downloading ' + images.length + ' images to your camera roll...');
        
        // In a real implementation, this would interface with the device's 
        // camera roll through a native app interface
        images.forEach((img, index) => {
          const imgSrc = img.getAttribute('src');
          if (!imgSrc) return;
          
          // For Mobile Safari, we need to open images in new tabs
          // as direct downloads don't work the same way
          const link = document.createElement('a');
          link.href = imgSrc;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          
          // Fallback: try direct download, works on some iOS browsers
          link.download = 'transparent-classroom-image-' + (index + 1) + '.jpg';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      });
    }
    
    // Bottom nav items
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems) {
      navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
          // Remove active class from all items
          navItems.forEach(navItem => navItem.classList.remove('active'));
          
          // Add active class to clicked item
          item.classList.add('active');
          
          // Handle navigation (to be implemented)
          const navLabels = ['Home', 'Profile', 'Classmates', 'Directory'];
          alert('Navigating to ' + navLabels[index]);
        });
      });
    }
  }
  
  function extractAndProcessData() {
    // This function analyzes the original page content
    // to extract and display relevant data in our mobile UI
    
    const activitiesContainer = document.getElementById('activities-container');
    if (!activitiesContainer) return;
    
    try {
      // Try to extract real data from the page
      const activities = extractActivitiesFromPage();
      
      if (activities && activities.length > 0) {
        // We have successfully extracted activities, show them
        renderActivities(activities, activitiesContainer);
        
        // Also populate the child selector
        populateChildSelector();
      } else {
        // No activities found - this likely means we couldn't properly extract data
        console.log("No activities found, reverting to original site view");
        
        // Remove our overlay and restore original content
        removeSkin();
        
        // Show a brief message explaining why we're reverting
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '10px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.borderRadius = '20px';
        messageDiv.style.zIndex = '10000';
        messageDiv.style.fontSize = '14px';
        messageDiv.style.maxWidth = '90%';
        messageDiv.style.textAlign = 'center';
        messageDiv.textContent = 'Mobile view not available for this page. Using desktop view instead.';
        
        document.body.appendChild(messageDiv);
        
        // Remove the message after a few seconds
        setTimeout(() => {
          messageDiv.style.opacity = '0';
          messageDiv.style.transition = 'opacity 0.5s';
          setTimeout(() => messageDiv.remove(), 500);
        }, 5000);
        
        return;
      }
    } catch (error) {
      console.error('Error extracting data:', error);
      
      // Show error message
      activitiesContainer.innerHTML = '<div class="error">Error loading activities. Restoring original site.</div>';
      
      // Revert to original site after a short delay
      setTimeout(() => {
        removeSkin();
      }, 1500);
    }
  }
  
  function extractActivitiesFromPage() {
    try {
      const originalContent = document.getElementById('tc-original-content');
      if (!originalContent) {
        console.error('Cannot find original content container');
        return [];
      }
      
      // Try multiple selector patterns to find activity elements
      // This approach tries various CSS classes and HTML structures that might be used
      // by Transparent Classroom to display activity posts
      
      // First try: Common post/activity classes
      let activityElements = originalContent.querySelectorAll(
        '.post, .activity-post, .observation, .activity, .entry, .journal-entry, ' +
        '.child-activity, .classroom-post, .timeline-item, .feed-item'
      );
      
      // If nothing found, try broader containers
      if (!activityElements || activityElements.length === 0) {
        console.log('No specific activity elements found, trying article tags');
        activityElements = originalContent.querySelectorAll('article, .article, .card, .panel');
      }
      
      // If still nothing, try looking for divs with specific content patterns
      if (!activityElements || activityElements.length === 0) {
        console.log('No article elements found, looking for content divs');
        
        // Find divs that contain images and text - likely to be activity posts
        const allDivs = originalContent.querySelectorAll('div');
        const contentDivs = [];
        
        allDivs.forEach(div => {
          // Check if div contains an image
          const hasImage = div.querySelector('img') !== null;
          // Check if div has a reasonable amount of text content
          const textContent = div.textContent.trim();
          const hasText = textContent.length > 20 && textContent.length < 2000;
          
          // Check for date patterns in text
          const hasDatePattern = 
            /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(textContent) || // MM/DD/YYYY
            /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2}\b/i.test(textContent) || // Month DD
            /\b(yesterday|today)\b/i.test(textContent);
          
          // If the div has good characteristics of an activity post, add it
          if ((hasImage && hasText) || (hasText && hasDatePattern)) {
            contentDivs.push(div);
          }
        });
        
        if (contentDivs.length > 0) {
          activityElements = contentDivs;
        } else {
          console.log('No content divs found either');
          return [];
        }
      }
      
      // Extract data from real activity elements
      const activities = [];
      
      // Process each activity element
      activityElements.forEach(element => {
        try {
          // Extract classroom info (typically in a header or title element)
          const classroomEl = element.querySelector('.classroom-name, .room-name, .class-name, h3');
          const classroom = classroomEl ? classroomEl.textContent.trim() : 'Classroom';
          
          // Extract date info
          const dateEl = element.querySelector('.date, .timestamp, .posted-at, time');
          const date = dateEl ? dateEl.textContent.trim() : 'Today';
          
          // Extract author info
          const authorEl = element.querySelector('.teacher, .author, .posted-by, .staff-name');
          const author = authorEl ? authorEl.textContent.trim() : 'Teacher';
          
          // Extract content
          const contentEl = element.querySelector('.content, .description, .notes, .body, p');
          const content = contentEl ? contentEl.textContent.trim() : '';
          
          // Extract image if available
          let imageUrl = null;
          const imageEl = element.querySelector('img');
          if (imageEl && imageEl.src) {
            imageUrl = imageEl.src;
          }
          
          // Add to activities array
          activities.push({
            classroom,
            date,
            author,
            content,
            imageUrl
          });
        } catch (err) {
          console.error('Error processing activity element:', err);
        }
      });
      
      return activities;
    } catch (error) {
      console.error('Error extracting activities from page:', error);
      return [];
    }
  }
  
  function renderActivities(activities, container) {
    // Clear container
    container.innerHTML = '';
    
    if (activities.length === 0) {
      container.innerHTML = '<div class="no-activities">No activities found for this day.</div>';
      return;
    }
    
    // Render each activity
    activities.forEach(activity => {
      const activityCard = document.createElement('div');
      activityCard.className = 'activity-card';
      
      // Add image if available
      if (activity.imageUrl) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'activity-image-container';
        
        const img = document.createElement('img');
        img.className = 'activity-image';
        img.src = activity.imageUrl;
        img.alt = 'Activity photo';
        imageContainer.appendChild(img);
        
        // Image action buttons
        const imageActions = document.createElement('div');
        imageActions.className = 'image-actions';
        
        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'image-action-button download-button';
        downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
        imageActions.appendChild(downloadBtn);
        
        // More button
        const moreBtn = document.createElement('button');
        moreBtn.className = 'image-action-button more-button';
        moreBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>';
        imageActions.appendChild(moreBtn);
        
        // Action menu (hidden by default)
        const actionMenu = document.createElement('div');
        actionMenu.className = 'action-menu';
        
        // View full size option
        const viewOption = document.createElement('div');
        viewOption.className = 'action-menu-item view-option';
        viewOption.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg> View full size';
        actionMenu.appendChild(viewOption);
        
        // Share option
        const shareOption = document.createElement('div');
        shareOption.className = 'action-menu-item share-option';
        shareOption.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> Share';
        actionMenu.appendChild(shareOption);
        
        // Save to camera roll option
        const saveOption = document.createElement('div');
        saveOption.className = 'action-menu-item save-option';
        saveOption.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Save to camera roll';
        actionMenu.appendChild(saveOption);
        
        imageActions.appendChild(actionMenu);
        imageContainer.appendChild(imageActions);
        
        activityCard.appendChild(imageContainer);
        
        // Set up menu toggle
        moreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          actionMenu.classList.toggle('visible');
        });
        
        // Close menu when clicking elsewhere
        document.addEventListener('click', () => {
          actionMenu.classList.remove('visible');
        });
        
        // Handle menu item clicks
        viewOption.addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(activity.imageUrl, '_blank');
          actionMenu.classList.remove('visible');
        });
        
        shareOption.addEventListener('click', (e) => {
          e.stopPropagation();
          if (navigator.share && activity.imageUrl) {
            navigator.share({
              title: 'Activity from ' + activity.classroom,
              text: activity.content,
              url: activity.imageUrl
            }).catch(err => {
              console.error('Share failed:', err);
              alert('Sharing is not supported on this device or browser');
            });
          } else {
            alert('Sharing is not supported on this device or browser');
          }
          actionMenu.classList.remove('visible');
        });
        
        saveOption.addEventListener('click', (e) => {
          e.stopPropagation();
          const link = document.createElement('a');
          link.href = activity.imageUrl;
          link.download = 'transparent-classroom-image.jpg';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          actionMenu.classList.remove('visible');
        });
        
        // Handle direct download button click
        downloadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const link = document.createElement('a');
          link.href = activity.imageUrl;
          link.download = 'transparent-classroom-image.jpg';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }
      
      // Create card content
      const content = document.createElement('div');
      content.className = 'activity-content';
      
      // Create header with classroom and date
      const header = document.createElement('div');
      header.className = 'activity-header';
      
      const classroomSpan = document.createElement('span');
      classroomSpan.className = 'activity-classroom';
      classroomSpan.textContent = activity.classroom;
      header.appendChild(classroomSpan);
      
      const dateSpan = document.createElement('span');
      dateSpan.className = 'activity-date';
      dateSpan.textContent = activity.date;
      header.appendChild(dateSpan);
      
      content.appendChild(header);
      
      // Add content text with some formatting
      const textDiv = document.createElement('div');
      textDiv.className = 'activity-text';
      
      // Process content to highlight child names
      if (activity.content) {
        let processedContent = activity.content;
        // Highlight names in the content (this is a simple example, could be expanded)
        const childNames = ['Cecilia', 'Cece', 'Emma', 'Olivia', 'Noah', 'Liam'];
        childNames.forEach(name => {
          const regex = new RegExp('\\b' + name + '\\b', 'gi');
          processedContent = processedContent.replace(regex, match => 
            `<span class="highlight">${match}</span>`);
        });
        
        textDiv.innerHTML = processedContent;
      }
      
      content.appendChild(textDiv);
      
      // Add author attribution
      if (activity.author) {
        const authorSection = document.createElement('div');
        authorSection.className = 'comment-section';
        
        const comment = document.createElement('div');
        comment.className = 'comment';
        
        const avatar = document.createElement('div');
        avatar.className = 'comment-avatar';
        // Get initials from author name
        const initials = activity.author.split(' ')
          .filter(part => part.length > 0)
          .map(part => part[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        avatar.textContent = initials;
        
        const commentContent = document.createElement('div');
        commentContent.className = 'comment-content';
        
        const authorName = document.createElement('div');
        authorName.className = 'comment-author';
        authorName.textContent = activity.author;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'comment-time';
        timeSpan.textContent = 'Teacher';
        
        authorName.appendChild(timeSpan);
        commentContent.appendChild(authorName);
        
        comment.appendChild(avatar);
        comment.appendChild(commentContent);
        authorSection.appendChild(comment);
        
        content.appendChild(authorSection);
      }
      
      activityCard.appendChild(content);
      
      // Add event listeners to action buttons
      activityCard.querySelectorAll('.activity-action-button').forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          
          if (button.classList.contains('download-button')) {
            // Handle download
            const imgSrc = activity.imageUrl;
            if (!imgSrc) return;
            
            // For Safari we need to open in a new tab
            window.open(imgSrc, '_blank');
            
          } else if (button.classList.contains('view-button')) {
            // Handle view full size
            if (activity.imageUrl) {
              window.open(activity.imageUrl, '_blank');
            }
          } else if (button.classList.contains('share-button')) {
            // Handle share
            if (navigator.share && activity.imageUrl) {
              navigator.share({
                title: 'Activity from ' + activity.classroom,
                text: activity.content,
                url: activity.imageUrl
              }).catch(err => {
                console.error('Share failed:', err);
                alert('Sharing is not supported on this device or browser');
              });
            } else {
              alert('Sharing is not supported on this device or browser');
            }
          }
        });
      });
      
      container.appendChild(activityCard);
    });
  }
  
  function populateChildSelector() {
    try {
      const childSelect = document.getElementById('child-select');
      if (!childSelect) return;
      
      // Clear existing options except the first one
      while (childSelect.options.length > 1) {
        childSelect.remove(1);
      }
      
      const originalContent = document.getElementById('tc-original-content');
      if (!originalContent) {
        console.error('Cannot find original content container for child data');
        return;
      }
      
      // Try to find child selector elements in the original page
      // These selectors need to be adjusted based on the actual structure of the website
      const childElements = originalContent.querySelectorAll('.child-option, .student-option, .child-select-option');
      
      // If no child elements found with specific classes, try to find dropdowns or select elements
      if (!childElements || childElements.length === 0) {
        const selectElements = originalContent.querySelectorAll('select');
        
        // Look through all select elements to find one likely containing children
        for (const select of selectElements) {
          // Check if select element contains children-related options
          const childOption = Array.from(select.options).find(opt => 
            opt.textContent.includes('child') || 
            select.id.includes('child') || 
            select.name.includes('child') ||
            select.className.includes('child')
          );
          
          if (childOption) {
            // Found likely child selector, use these options
            Array.from(select.options).forEach(opt => {
              if (opt.value && opt.textContent.trim() !== '') {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.textContent.trim();
                childSelect.appendChild(option);
              }
            });
            break;
          }
        }
      } else {
        // Process direct child elements
        childElements.forEach(element => {
          const value = element.getAttribute('data-id') || element.getAttribute('value') || '';
          const name = element.textContent.trim();
          
          if (name) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = name;
            childSelect.appendChild(option);
          }
        });
      }
      
      // If no children found via any method, add a message option
      if (childSelect.options.length <= 1) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No children found - try switching pages';
        option.disabled = true;
        childSelect.appendChild(option);
      }
      
      // Add event listener for child selection
      childSelect.addEventListener('change', function() {
        const selectedChildId = childSelect.value;
        if (selectedChildId) {
          // Find child-specific activities
          const activitiesContainer = document.getElementById('activities-container');
          if (activitiesContainer) {
            activitiesContainer.innerHTML = '<div class="loading">Loading activities for selected child...</div>';
            
            // In a real implementation, this would filter or request child-specific activities
            setTimeout(() => {
              extractAndProcessData();
            }, 500);
          }
        }
      });
    } catch (error) {
      console.error('Error populating child selector:', error);
    }
  }
})();
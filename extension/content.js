(function() {
  let skinEnabled = true;
  let mobileApp = null;
  let originalContent = null;
  let currentTheme = 'system';
  
  // Initialize on load
  init();
  
  function init() {
    // Check if skin is enabled in settings
    chrome.storage.sync.get(['enabled', 'theme'], function(data) {
      if (data.enabled !== undefined) {
        skinEnabled = data.enabled;
      }
      
      if (data.theme) {
        currentTheme = data.theme;
      }
      
      if (skinEnabled) {
        applySkin();
      }
    });
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'toggleSkin') {
        skinEnabled = request.enabled;
        
        if (skinEnabled) {
          applySkin();
        } else {
          removeSkin();
        }
      } else if (request.action === 'setTheme') {
        currentTheme = request.theme;
        updateTheme();
      }
    });
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
    mobileApp.style.backgroundColor = '#ffffff';
    mobileApp.style.overflow = 'auto';
    
    // Create the UI structure
    createMobileUI(mobileApp);
    
    // Replace body content with our app
    document.body.appendChild(mobileApp);
    
    // Hide original content but keep it in DOM for data extraction
    const originalContentContainer = document.createElement('div');
    originalContentContainer.id = 'tc-original-content';
    originalContentContainer.style.display = 'none';
    
    // Move all body children (except our app) to the hidden container
    Array.from(document.body.children).forEach(child => {
      if (child !== mobileApp) {
        originalContentContainer.appendChild(child);
      }
    });
    
    document.body.appendChild(originalContentContainer);
    
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
        if (currentTheme === 'system') {
          mobileApp.classList.remove('theme-light', 'theme-dark');
          mobileApp.classList.add(event.matches ? 'theme-dark' : 'theme-light');
        }
      });
    }
  }
  
  function createMobileUI(container) {
    // Create header
    const header = document.createElement('div');
    header.className = 'tc-mobile-header';
    header.innerHTML = `
      <div class="header-content">
        <button class="menu-button">
          <span class="menu-icon"></span>
        </button>
        <h1>Transparent Classroom</h1>
        <div class="child-selector">
          <select id="child-select">
            <option value="">Select a child</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(header);
    
    // Create main content area
    const main = document.createElement('div');
    main.className = 'tc-mobile-main';
    main.innerHTML = `
      <div class="date-filter">
        <button class="date-button">Filter by date</button>
        <button class="save-all-button">Save All to Camera Roll</button>
      </div>
      <div class="activities-container" id="activities-container">
        <div class="loading">Loading activities...</div>
      </div>
    `;
    container.appendChild(main);
    
    // Create bottom navigation
    const bottomNav = document.createElement('div');
    bottomNav.className = 'tc-mobile-bottom-nav';
    bottomNav.innerHTML = `
      <div class="nav-item active">
        <span class="nav-icon home-icon"></span>
        <span class="nav-label">Home</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon profile-icon"></span>
        <span class="nav-label">Profile</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon classmates-icon"></span>
        <span class="nav-label">Classmates</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon directory-icon"></span>
        <span class="nav-label">Directory</span>
      </div>
    `;
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
      
      /* Light Theme (Default) */
      #tc-mobile-skin {
        --background: #ffffff;
        --foreground: #333333;
        --muted-foreground: #666666;
        --primary: #4a6da7;
        --primary-foreground: #ffffff;
        --secondary: #f5f5f5;
        --secondary-foreground: #333333;
        --border: #e0e0e0;
        --card: #ffffff;
        --card-foreground: #333333;
        --card-border: #f0f0f0;
        --accent: #f0f4ff;
        --accent-foreground: #4a6da7;
      }
      
      /* Dark Theme */
      #tc-mobile-skin.theme-dark {
        --background: #1a1a1a;
        --foreground: #f0f0f0;
        --muted-foreground: #bbbbbb;
        --primary: #6484c1;
        --primary-foreground: #ffffff;
        --secondary: #2a2a2a;
        --secondary-foreground: #f0f0f0;
        --border: #444444;
        --card: #2a2a2a;
        --card-foreground: #f0f0f0;
        --card-border: #3a3a3a;
        --accent: #273958;
        --accent-foreground: #6484c1;
      }
      
      #tc-mobile-skin, 
      #tc-mobile-skin.theme-light {
        background-color: var(--background);
        color: var(--foreground);
      }
      
      /* Header */
      .tc-mobile-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background-color: var(--primary);
        color: var(--primary-foreground);
        padding: 0 16px;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .header-content {
        display: flex;
        align-items: center;
        height: 100%;
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
      }
      
      .menu-icon {
        width: 20px;
        height: 2px;
        background-color: var(--primary-foreground);
        position: relative;
      }
      
      .menu-icon:before,
      .menu-icon:after {
        content: '';
        position: absolute;
        width: 20px;
        height: 2px;
        background-color: var(--primary-foreground);
        left: 0;
      }
      
      .menu-icon:before {
        top: -6px;
      }
      
      .menu-icon:after {
        bottom: -6px;
      }
      
      .tc-mobile-header h1 {
        flex: 1;
        margin-left: 16px;
        font-size: 18px;
        font-weight: 600;
      }
      
      .child-selector select {
        background-color: rgba(255,255,255,0.2);
        border: none;
        border-radius: 16px;
        color: var(--primary-foreground);
        padding: 6px 24px 6px 12px;
        font-size: 14px;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 16px;
      }
      
      /* Main content */
      .tc-mobile-main {
        padding: 70px 16px 70px;
        overflow-y: auto;
        height: 100%;
        background-color: var(--background);
      }
      
      .date-filter {
        display: flex;
        margin-bottom: 16px;
        gap: 8px;
      }
      
      .date-button {
        background-color: var(--secondary);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 14px;
        color: var(--secondary-foreground);
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      
      .date-button:before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
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
      
      .activity-card {
        background-color: var(--card);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        margin-bottom: 16px;
        overflow: hidden;
        border: 1px solid var(--border);
      }
      
      .activity-header {
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--card-border);
      }
      
      .activity-meta {
        font-size: 14px;
      }
      
      .activity-classroom {
        font-weight: 600;
        color: var(--card-foreground);
      }
      
      .activity-date {
        color: var(--muted-foreground);
        font-size: 12px;
      }
      
      .activity-author {
        font-size: 12px;
        color: var(--primary);
      }
      
      .activity-content {
        padding: 16px;
      }
      
      .activity-text {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 16px;
        color: var(--card-foreground);
      }
      
      .activity-image {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 12px;
      }
      
      .activity-actions {
        display: flex;
        gap: 12px;
      }
      
      .activity-action-button {
        background-color: var(--secondary);
        border: none;
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 12px;
        color: var(--secondary-foreground);
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      }
      
      /* Bottom Navigation */
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
      
      .profile-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .classmates-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='9' cy='7' r='4'%3E%3C/circle%3E%3Cpath d='M23 21v-2a4 4 0 0 0-3-3.87'%3E%3C/path%3E%3Cpath d='M16 3.13a4 4 0 0 1 0 7.75'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .directory-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }
      
      /* Loading */
      .loading {
        text-align: center;
        padding: 20px;
        color: var(--muted-foreground);
      }
    `;
    document.head.appendChild(style);
  }
  
  function setupEventListeners() {
    // Menu button - toggle side menu
    const menuButton = document.querySelector('.menu-button');
    if (menuButton) {
      menuButton.addEventListener('click', function() {
        // Toggle a side menu (to be implemented)
        alert('Side menu coming soon!');
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
          
          // Create a download link
          const link = document.createElement('a');
          link.href = imgSrc;
          link.download = 'transparent-classroom-image-' + (index + 1) + '.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Add a small delay between downloads
          setTimeout(() => {}, 300 * index);
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
    // This function would analyze the original page content
    // to extract and display relevant data in our mobile UI
    
    const activitiesContainer = document.getElementById('activities-container');
    if (!activitiesContainer) return;
    
    // Sample data - in a real extension, this would be extracted from the page
    const sampleActivities = [
      {
        classroom: 'Sunflower Room',
        date: 'Today',
        author: 'Ms. Jessica',
        content: 'Today we explored color mixing and painted with watercolors!',
        imageUrl: 'https://images.unsplash.com/photo-1560859268-3df928e195d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        classroom: 'Sunflower Room',
        date: 'Yesterday',
        author: 'Ms. Jessica',
        content: 'Learning about shapes and patterns through play.',
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        classroom: 'Sunflower Room',
        date: '2 days ago',
        author: 'Ms. Jessica',
        content: 'Story time! We read "The Very Hungry Caterpillar" and discussed healthy food choices.',
        imageUrl: null
      }
    ];
    
    // Render activities
    activitiesContainer.innerHTML = '';
    sampleActivities.forEach(activity => {
      const activityCard = document.createElement('div');
      activityCard.className = 'activity-card';
      
      // Create card header
      const header = document.createElement('div');
      header.className = 'activity-header';
      
      const metaDiv = document.createElement('div');
      metaDiv.className = 'activity-meta';
      
      const classroomDiv = document.createElement('div');
      classroomDiv.className = 'activity-classroom';
      classroomDiv.textContent = activity.classroom;
      metaDiv.appendChild(classroomDiv);
      
      const dateDiv = document.createElement('div');
      dateDiv.className = 'activity-date';
      dateDiv.textContent = activity.date;
      metaDiv.appendChild(dateDiv);
      
      header.appendChild(metaDiv);
      
      const authorDiv = document.createElement('div');
      authorDiv.className = 'activity-author';
      authorDiv.textContent = activity.author;
      header.appendChild(authorDiv);
      
      activityCard.appendChild(header);
      
      // Create card content
      const content = document.createElement('div');
      content.className = 'activity-content';
      
      const textDiv = document.createElement('div');
      textDiv.className = 'activity-text';
      textDiv.textContent = activity.content;
      content.appendChild(textDiv);
      
      // Add image if available
      if (activity.imageUrl) {
        const img = document.createElement('img');
        img.className = 'activity-image';
        img.src = activity.imageUrl;
        img.alt = 'Activity photo';
        content.appendChild(img);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'activity-actions';
        
        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'activity-action-button download-button';
        
        const downloadIcon = document.createElement('span');
        downloadIcon.className = 'action-icon';
        downloadIcon.textContent = '↓';
        downloadBtn.appendChild(downloadIcon);
        
        downloadBtn.appendChild(document.createTextNode(' Download'));
        actionsDiv.appendChild(downloadBtn);
        
        // View button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'activity-action-button view-button';
        
        const viewIcon = document.createElement('span');
        viewIcon.className = 'action-icon';
        viewIcon.textContent = '👁️';
        viewBtn.appendChild(viewIcon);
        
        viewBtn.appendChild(document.createTextNode(' View Full Size'));
        actionsDiv.appendChild(viewBtn);
        
        // Share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'activity-action-button share-button';
        
        const shareIcon = document.createElement('span');
        shareIcon.className = 'action-icon';
        shareIcon.textContent = '↗️';
        shareBtn.appendChild(shareIcon);
        
        shareBtn.appendChild(document.createTextNode(' Share'));
        actionsDiv.appendChild(shareBtn);
        
        content.appendChild(actionsDiv);
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
            
            const link = document.createElement('a');
            link.href = imgSrc;
            link.download = 'transparent-classroom-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
      
      activitiesContainer.appendChild(activityCard);
    });
    
    // Populate child selector (sample data)
    const childSelect = document.getElementById('child-select');
    if (childSelect) {
      const sampleChildren = [
        { id: 1, name: 'Emma Johnson' },
        { id: 2, name: 'Noah Williams' },
        { id: 3, name: 'Olivia Smith' }
      ];
      
      sampleChildren.forEach(child => {
        const option = document.createElement('option');
        option.value = child.id.toString();
        option.textContent = child.name;
        childSelect.appendChild(option);
      });
      
      // Add event listener for child selection
      childSelect.addEventListener('change', function() {
        const selectedChildId = childSelect.value;
        if (selectedChildId) {
          alert('Showing activities for child ID: ' + selectedChildId);
          // In a real extension, this would filter activities
        }
      });
    }
  }
})();
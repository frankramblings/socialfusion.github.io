document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('skinToggle');
  const statusText = document.getElementById('statusText');
  const themeOptions = document.querySelectorAll('.theme-option');
  
  // Load saved state
  chrome.storage.sync.get(['enabled', 'theme'], function(data) {
    // Handle skin toggle
    if (data.enabled !== undefined) {
      toggle.checked = data.enabled;
      updateStatus(data.enabled);
    } else {
      // Default to enabled if no preference saved
      chrome.storage.sync.set({enabled: true});
    }
    
    // Handle theme selection
    const savedTheme = data.theme || 'system';
    themeOptions.forEach(option => {
      if (option.dataset.theme === savedTheme) {
        selectThemeOption(option);
      }
    });
  });
  
  // Handle toggle changes
  toggle.addEventListener('change', function() {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({enabled: isEnabled});
    updateStatus(isEnabled);
    
    // Send message to content script
    sendMessageToContentScript({
      action: 'toggleSkin',
      enabled: isEnabled
    });
  });
  
  // Handle theme option clicks
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.dataset.theme;
      
      // Update UI
      selectThemeOption(this);
      
      // Save preference
      chrome.storage.sync.set({theme: theme});
      
      // Send message to content script
      sendMessageToContentScript({
        action: 'setTheme',
        theme: theme
      });
    });
  });
  
  function selectThemeOption(selectedOption) {
    // Remove selected class from all options
    themeOptions.forEach(option => {
      option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    selectedOption.classList.add('selected');
  }
  
  function updateStatus(enabled) {
    statusText.textContent = enabled ? 'Mobile skin is active' : 'Mobile skin is disabled';
  }
  
  function sendMessageToContentScript(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs && tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    });
  }
});
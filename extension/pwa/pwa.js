// PWA initialization and setup
let deferredPrompt; // Used to show the install prompt

// Handle authentication state
let isAuthenticated = false;

window.addEventListener('load', () => {
  // Check if we have an auth token in localStorage
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    isAuthenticated = true;
    // Redirect to home page if authenticated
    window.location.href = '/home';
  }
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  }
});

// Handle app installation
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Show the install banner after a delay
  setTimeout(() => {
    showInstallBanner();
  }, 5000);
});

// Show install banner
function showInstallBanner() {
  if (!deferredPrompt) return;

  const banner = document.getElementById('install-banner');
  banner.classList.add('visible');

  const installButton = document.getElementById('install-button');
  const dismissButton = document.getElementById('dismiss-button');

  installButton.addEventListener('click', () => {
    banner.classList.remove('visible');

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });

  dismissButton.addEventListener('click', () => {
    banner.classList.remove('visible');

    // Remember this choice in localStorage
    localStorage.setItem('tc_install_dismissed', 'true');
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading');
  const frame = document.getElementById('tc-frame');
  const initialLogin = document.getElementById('initial-login');
  const schoolUrl = document.getElementById('school-url');
  const loginButton = document.getElementById('login-button');

  // Check if we have a saved school URL
  const savedSchool = localStorage.getItem('tc_school_url');

  if (savedSchool) {
    initialLogin.classList.add('hidden');
    loadTransparentClassroom(savedSchool);
  }

  // Handle login form submission
  initialLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = schoolUrl.value.trim();
    
    // Add https:// if missing
    const finalUrl = !url.startsWith('https://') && !url.startsWith('http://') 
      ? 'https://' + url 
      : url;
      
    // Save the URL and load in frame
    localStorage.setItem('tc_school_url', finalUrl);
    const frame = document.getElementById('tc-frame');
    frame.src = finalUrl;
    initialLogin.classList.add('hidden');
  });


  // Handle login button click
  loginButton.addEventListener('click', () => {
    let url = schoolUrl.value.trim();

    // Add https:// if missing
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = 'https://' + url;
    }

    // Save the URL
    localStorage.setItem('tc_school_url', url);

    // Redirect to the actual login page
    window.location.href = url;
  });

  // Handle frame load events
  frame.addEventListener('load', () => {
    frame.classList.add('loaded');
    loading.classList.add('hidden');

    // Inject our mobile skin script
    try {
      injectMobileSkin(frame);
    } catch (error) {
      console.error('Error injecting mobile skin:', error);
    }
  });
});

// Load the Transparent Classroom site in the iframe
function loadTransparentClassroom(url) {
  const frame = document.getElementById('tc-frame');
  frame.src = url;
}

// Inject the mobile skin into the iframe
function injectMobileSkin(frame) {
  try {
    const frameWindow = frame.contentWindow;
    const frameDocument = frame.contentDocument;

    if (!frameWindow || !frameDocument) {
      throw new Error('Cannot access iframe content - possible CORS restriction');
    }

    // Create a script element to inject our mobile skin
    const script = frameDocument.createElement('script');

    // We'll use the content from mobile-skin.js
    fetch('./mobile-skin.js')
      .then(response => response.text())
      .then(code => {
        script.textContent = code;
        frameDocument.head.appendChild(script);

        console.log('Mobile skin injected successfully');
      })
      .catch(error => {
        console.error('Error fetching mobile skin script:', error);
      });
  } catch (error) {
    console.error('Error injecting skin:', error);

    // If we can't inject due to CORS, show a message to the user
    const loading = document.getElementById('loading');
    loading.innerHTML = `
      <h1>Unable to Load</h1>
      <p>Due to security restrictions, we can't apply the mobile skin directly.</p>
      <p>Please try using the UserScript approach instead.</p>
    `;
    loading.style.backgroundColor = '#e74c3c';
  }
}
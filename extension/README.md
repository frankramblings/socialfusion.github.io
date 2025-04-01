# Transparent Classroom Mobile Skin

A browser extension that enhances the mobile experience of Transparent Classroom by applying a responsive, mobile-friendly interface.

## Features

- Mobile-optimized interface for Transparent Classroom
- Responsive design that works on phones, tablets, and desktops
- Date-based filtering of activities
- "Save All to Camera Roll" feature for photos
- Bottom navigation for mobile-friendly access
- Easy child selection

## Installation Instructions

### Chrome / Edge

1. Download this folder by clicking the "Download ZIP" button on GitHub
2. Unzip the folder to a location on your computer
3. Open Chrome or Edge and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top-right corner
5. Click "Load unpacked" and select the unzipped extension folder
6. The extension should now appear in your browser's extension list

### Firefox

1. Download this folder
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Navigate to the downloaded folder and select any file (like `manifest.json`)
5. The extension will be loaded temporarily (will need to be reloaded after restarting Firefox)

## Usage

1. Log in to Transparent Classroom as you normally would
2. Click on the extension icon in your browser toolbar to toggle the mobile interface
3. Browse through the mobile-friendly interface:
   - Use the bottom navigation for quick access to different sections
   - Select dates to filter activities
   - Use the "Save All to Camera Roll" button to download all photos from a selected date

## Note

This extension is a customized interface for Transparent Classroom. It does not modify or store any data from the website itself - it simply provides an alternative view that's more mobile-friendly.

## Technical Details

This extension works by:
1. Injecting a custom UI layer over the original Transparent Classroom website
2. Extracting data from the original page and displaying it in a mobile-friendly format
3. Maintaining all the original functionality while improving the mobile experience

The extension is entirely client-side and does not send any data to external servers.
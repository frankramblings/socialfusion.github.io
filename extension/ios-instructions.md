# Using the Transparent Classroom Mobile Skin on iOS (Safari)

Since Safari on iOS doesn't support traditional browser extensions like Chrome or Firefox, we've created a special userscript version that works with iOS Safari.

## Option 1: Using the UserScripts App (Recommended)

1. **Install UserScripts app** from the App Store
   - Search for "UserScripts" by Justin Wasack
   - This is a free app that lets you run userscripts in Safari

2. **Set up the UserScripts app**
   - Open the app and follow the initial setup instructions
   - Enable the Safari extension in Settings:
     - Go to Settings > Safari > Extensions
     - Find "UserScripts" and toggle it on
     - Set "All Websites" permission to "Allow"

3. **Add the Transparent Classroom Mobile Skin script**
   - In the UserScripts app, tap the + button
   - Select "Import from File" or "Import from URL"
   - Navigate to where you saved our `transparent-classroom-mobile.user.js` file (or enter the URL if hosted online)
   - Tap "Import"

4. **Using the script**
   - Open Safari and navigate to your Transparent Classroom site
   - Tap the "Aa" button in the address bar
   - Select "UserScripts" and make sure our script is enabled
   - You should now see a floating button that lets you toggle the mobile interface
   - Long-press the button to cycle through themes (Light/Dark/System)

## Option 2: Using a Bookmarklet

If you prefer not to install an app, you can use a bookmarklet approach:

1. **Create a new bookmark in Safari**
   - Navigate to any page in Safari
   - Tap the share button
   - Scroll down and tap "Add Bookmark"
   - Name it "TC Mobile View"

2. **Edit the bookmark to make it a bookmarklet**
   - Go to Safari Bookmarks
   - Tap "Edit"
   - Find your "TC Mobile View" bookmark and tap it
   - Replace the URL with this code (we'll provide a minified version of our script)
   - Save the bookmark

3. **Using the bookmarklet**
   - Go to your Transparent Classroom site
   - Tap in the address bar
   - Start typing "TC Mobile" to find your bookmarklet
   - Tap on it to activate the mobile interface

## Notes for iOS Usage

- **Camera Roll Access**: Due to iOS security restrictions, images open in new tabs instead of downloading directly. You can long-press on images and select "Add to Photos" to save them to your camera roll.
- **Performance**: The userscript version might be slightly slower than a native app but provides all the same features.
- **Updates**: Check back for updated versions of the script with new features and improvements.
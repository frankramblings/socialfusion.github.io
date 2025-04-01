# Transparent Classroom Mobile PWA

This Progressive Web App (PWA) allows you to use the Transparent Classroom website with a mobile-friendly interface that can be installed on your iOS device directly from Safari.

## How to Use on iOS Safari

1. **Host the PWA files**
   - Upload all files in this folder to a web server
   - You can use GitHub Pages, Netlify, or any other static hosting service
   - Make sure the server uses HTTPS (required for PWAs)

2. **Access the PWA in Safari**
   - Open Safari on your iOS device
   - Navigate to the URL where you hosted the PWA files
   - Enter your Transparent Classroom school URL when prompted

3. **Install to Home Screen**
   - Tap the share button in Safari (square with arrow)
   - Scroll down and select "Add to Home Screen"
   - Give it a name like "TC Mobile" and tap "Add"
   - The app icon will appear on your home screen

4. **Use Like a Native App**
   - Open the app from your home screen
   - It will run in full-screen mode without Safari's interface
   - All settings will be saved between sessions

## Features

- **Mobile-friendly interface**: Designed specifically for touch screens and smaller displays
- **Light/Dark theme support**: Automatically switches based on your device settings or manual selection
- **Save All to Camera Roll**: Easily save all photos from a given date
- **Works offline**: Basic features work even without an internet connection
- **Real-time updates**: Automatically updates when new versions are available

## How It Works

This PWA acts as a wrapper around the actual Transparent Classroom website. It loads the real website in the background, extracts the data, and presents it in a mobile-friendly interface.

## Security Notes

- This PWA does not store your credentials or send them to any third-party servers
- All data is processed locally on your device
- Your login information is sent directly to the official Transparent Classroom servers

## Troubleshooting

- **Website doesn't load**: Make sure you entered the correct URL for your school
- **Can't install**: Ensure you're using Safari (PWA installation doesn't work with Chrome on iOS)
- **Images don't download**: Use the "View Full Size" option and save images manually

## Advanced: Self-hosting

If you want to host this PWA on your own server:

1. Upload all files to your server
2. Configure your server to enable HTTPS
3. Share the URL with others who want to use it

For extra security, you can customize the code to only work with specific Transparent Classroom school URLs.
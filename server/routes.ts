import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the manifest.json file
  app.get('/manifest.json', (req, res) => {
    res.json({
      name: "Transparent Classroom",
      short_name: "TC Mobile",
      description: "Modern mobile interface for Transparent Classroom",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#6b8e50",
      icons: [
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    });
  });

  // Serve the service worker
  app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    // Read the service worker file
    const swPath = path.join(__dirname, '../public/sw.js');
    if (fs.existsSync(swPath)) {
      const swContent = fs.readFileSync(swPath, 'utf8');
      res.send(swContent);
    } else {
      // Create a basic service worker if file doesn't exist
      const sw = `
        const CACHE_NAME = 'tc-mobile-v1';
        const urlsToCache = [
          '/',
          '/index.html',
          '/manifest.json',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ];

        self.addEventListener('install', (event) => {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => {
                return cache.addAll(urlsToCache);
              })
          );
        });

        self.addEventListener('fetch', (event) => {
          event.respondWith(
            caches.match(event.request)
              .then((response) => {
                if (response) {
                  return response;
                }
                return fetch(event.request)
                  .then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                      .then((cache) => {
                        cache.put(event.request, responseToCache);
                      });
                    return response;
                  });
              })
          );
        });

        self.addEventListener('activate', (event) => {
          const cacheWhitelist = [CACHE_NAME];
          event.waitUntil(
            caches.keys().then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                  }
                })
              );
            })
          );
        });
      `;
      res.send(sw);
    }
  });

  // Serve the bookmarklet script
  app.get('/bookmarklet.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    // Create the bookmarklet script
    const bookmarklet = `
      (function() {
        // Check if already injected
        if (document.getElementById('tc-mobile-styles')) {
          console.log('TC Mobile already injected');
          return;
        }

        // Create styles
        const style = document.createElement('style');
        style.id = 'tc-mobile-styles';
        style.textContent = \`
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
          .card {
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
        \`;
        
        document.head.appendChild(style);
        
        // Add meta viewport if not present
        if (!document.querySelector('meta[name="viewport"]')) {
          const viewport = document.createElement('meta');
          viewport.name = 'viewport';
          viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
          document.head.appendChild(viewport);
        }
        
        // Add notification
        const notification = document.createElement('div');
        notification.style.cssText = \`
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
          transition: opacity 0.3s ease-in-out;
        \`;
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
    `;
    
    res.send(bookmarklet);
  });

  // Create http server
  const httpServer = createServer(app);

  return httpServer;
}

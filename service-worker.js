const CACHE_VERSION = "portfolio-v1.6.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./src/js/app.js",
  "./src/js/app.runtime.js",
  "./src/css/site.css",
  "./src/js/components.js",
  "./public/css/bootstrap.min.css",
  "./public/js/bootstrap.bundle.min.js",
  "./public/images/AI Story Creator.jpg",
  "./public/images/Amazon Dummy.jpg",
  "./public/images/Automated Floor Cleaner.jpg",
  "./public/images/Bird Species Detection.jpg",
  "./public/images/BMI Calculator App.jpg",
  "./public/images/C Tic Tac Toe Game.jpg",
  "./public/images/C_Piano.jpg",
  "./public/images/CIFAR-10 Classification.jpg",
  "./public/images/Climate_Analysis_Dashboard.jpg",
  "./public/images/Conversational Chatbot.jpg",
  "./public/images/Customer Churn Prediction.jpg",
  "./public/images/Data Analysis on Climate Change.jpg",
  "./public/images/Data Visualization on Death and Wars.jpg",
  "./public/images/Database App.jpg",
  "./public/images/E-Commerce Website.jpg",
  "./public/images/Electricity Analysis with R.jpg",
  "./public/images/Fingerprint Security System.jpg",
  "./public/images/FemTrack - Menstrual Cycle Tracker and Fertility Predictor.jpg",
  "./public/images/FinTak_Monthly_Spending.jpg",
  "./public/images/Haar Cascade Face Detection.jpg",
  "./public/images/Haar Cascade Vehicle Detection.jpg",
  "./public/images/Hangman App.JPG",
  "./public/images/Hard Coded MLP.jpg",
  "./public/images/Illusion.jpg",
  "./public/images/Image Space and Color Detect.jpg",
  "./public/images/Image Viewer.jpg",
  "./public/images/Indus Valley Script Analysis.jpg",
  "./public/images/IOT-Enabled Analog Clock With Remote Time Adjustment.jpg",
  "./public/images/Language_Converter_Tool.jpg",
  "./public/images/Library Management App.jpg",
  "./public/images/MCA Vault - Academic and Placement Portal.jpg",
  "./public/images/Maven Dependency Analyzer and Vulnerability Scanner.jpg",
  "./public/images/Moisture Detection and Prediction System.jpg",
  "./public/images/Number Guessing App.jpg",
  "./public/images/Number to Word Converter.jpg",
  "./public/images/OTP Verification App.jpg",
  "./public/images/Password Encrypter App.jpg",
  "./public/images/Predictive Analytics for Youth Mental Health.jpg",
  "./public/profile/profile.jpg",
  "./public/images/Python Calculator.jpg",
  "./public/images/QR Code App.jpg",
  "./public/images/Quiz App.jpg",
  "./public/images/RAG-based CV Chatbot.jpg",
  "./public/images/Rail_Madad_Chatbot.jpg",
  "./public/images/Random Password Generator.jpg",
  "./public/images/Registration and Login System in C.jpg",
  "./public/images/ResumeRecon.jpg",
  "./public/images/Robotic Car.jpg",
  "./public/images/Rock Paper Scissors App.JPG",
  "./public/images/Sanjeevani_AI_Doctor.jpg",
  "./public/images/Security Management Website.jpg",
  "./public/images/Sentiment Analysis on Tweets.jpg",
  "./public/images/Smart Container.jpg",
  "./public/images/Smart Key Rack Device With Weight-Based Authentication and IoT Notification System.jpg",
  "./public/images/Smart Pillow.jpg",
  "./public/images/Smart Room.jpg",
  "./public/images/Smart Watch.jpg",
  "./public/images/Solar Cell Follower.jpg",
  "./public/images/Sustainable Elevator.jpg",
  "./public/images/TextEdit App Colab.jpg",
  "./public/images/To Do List.jpg",
  "./public/images/Traffic Management System.jpg",
  "./public/images/Weather App.jpg",
  "./public/images/Weather Station.jpg",
  "./public/images/WiFi Based Security System.jpg",
  "./public/images/YouTube Doubt Solver.jpg",
  "./public/logo/android-chrome-192x192.png",
  "./public/logo/android-chrome-512x512.png",
  "./public/logo/apple-touch-icon.png",
  "./public/logo/favicon.ico",
  "./public/logo/favicon-32x32.png",
  "./public/logo/favicon-16x16.png",
  "./public/logo/logo.png",
  "./public/logo/site.webmanifest",
];

const CDN_ASSETS = [
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-brands-400.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-regular-400.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-solid-900.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-v4compatibility.woff2",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
];

async function cacheCdnAssets(cache) {
  await Promise.allSettled(
    CDN_ASSETS.map(async (asset) => {
      const request = new Request(asset, { mode: "no-cors" });
      const response = await fetch(request);
      if (response && (response.ok || response.type === "opaque")) {
        await cache.put(request, response);
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(async (cache) => {
        await cache.addAll(PRECACHE_ASSETS);
        await cacheCdnAssets(cache);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const isLocalAsset = requestUrl.origin === self.location.origin;
  const isFreshFirstAsset =
    event.request.destination === "document" ||
    requestUrl.pathname.endsWith(".json") ||
    requestUrl.pathname.endsWith(".js") ||
    requestUrl.pathname.endsWith(".css");

  if (!isLocalAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request).then((response) => {
          if (response && (response.status === 200 || response.type === "opaque")) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        });
      }),
    );
    return;
  }

  if (isFreshFirstAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    }),
  );
});

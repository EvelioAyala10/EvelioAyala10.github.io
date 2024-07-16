self.addEventListener('install', (event) => {
  console.log('Service Worker instalando.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativando.');
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
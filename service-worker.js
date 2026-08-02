// service-worker.js - Pincha Data
//
// Este archivo permite que las notificaciones se muestren en la bandeja
// del sistema operativo (junto a WhatsApp, Instagram, etc.) en vez de
// quedar encerradas dentro de la pestana del navegador.
//
// IMPORTANTE: subi este archivo a la MISMA carpeta que index.html en tu
// hosting. Si no esta en el mismo lugar, la app va a seguir funcionando
// pero sin notificaciones a nivel sistema (solo la campanita interna).

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxcxTN2PMGZEdhj1tJcyptwRX86yg2E1w",
  authDomain: "pincha-data.firebaseapp.com",
  projectId: "pincha-data",
  storageBucket: "pincha-data.firebasestorage.app",
  messagingSenderId: "1037476088393",
  appId: "1:1037476088393:web:0ba7365440eef06c764d98"
});

const messaging = firebase.messaging();

// Se dispara cuando llega un push y la app esta cerrada o en segundo plano.
messaging.onBackgroundMessage(function (payload) {
  const title = (payload.notification && payload.notification.title) || 'Pincha Data';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: './icon-192.png',
    badge: './icon-192.png'
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Al tocar la notificacion, lleva a la app (o la abre si estaba cerrada)
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientsArr) {
      var i;
      for (i = 0; i < clientsArr.length; i++) {
        if (clientsArr[i].url.indexOf(self.registration.scope) !== -1) {
          return clientsArr[i].focus();
        }
      }
      return self.clients.openWindow('./');
    })
  );
});

// ============================================================
// Service Worker — Pincha Data
// ============================================================
// IMPORTANTE (léase antes de tocar este archivo):
// Este service worker NO guarda en caché el archivo principal de la app
// (index.html) ni ningún otro recurso de la página. A propósito.
//
// Por qué: tuvimos varios problemas donde el celular seguía mostrando
// una versión vieja de la app después de subir una actualización nueva,
// obligando a desinstalar y reinstalar la app para que se vea el cambio.
// La causa: los service workers, por diseño, pueden quedarse "pegados"
// sirviendo contenido guardado de antes, y el navegador no siempre se
// da cuenta de que hay contenido nuevo esperando.
//
// La solución más simple y confiable: este service worker se limita
// pura y exclusivamente a manejar las notificaciones push. Para todo
// lo demás, deja pasar el pedido directo a internet, sin interceptarlo
// ni guardar nada — así el celular siempre trae la versión más nueva
// de la app cada vez que se abre, sin necesidad de reinstalar nunca.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBxcxTN2PMGZEdhj1tJcyptwRX86yg2E1w",
  authDomain: "pincha-data.firebaseapp.com",
  projectId: "pincha-data",
  storageBucket: "pincha-data.firebasestorage.app",
  messagingSenderId: "1037476088393",
  appId: "1:1037476088393:web:0ba7365440eef06c764d98"
};

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp(firebaseConfig);

// skipWaiting + clients.claim: apenas se detecta una versión nueva de ESTE archivo,
// toma el control de inmediato, sin esperar a que se cierren todas las pestañas abiertas.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A propósito: NO hay ningún listener de 'fetch' acá. Eso significa que este service
// worker no intercepta ni guarda en caché ninguna otra parte de la app — todo pedido
// (el HTML, el CSS, el JS) va directo a internet como si no hubiera service worker
// de por medio para esos casos. Solo nos ocupamos de lo nuestro: las notificaciones push.

self.addEventListener('push', function (event) {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch (e) { /* payload no era JSON */ }
  const data = payload.data || payload.notification || {};
  const title = data.title || 'Pincha Data';
  const body = data.body || '';
  const options = {
    body: body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'pincha-data-' + Date.now()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

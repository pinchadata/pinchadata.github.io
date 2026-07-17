// service-worker.js - Pincha Data
//
// Este archivo permite que las notificaciones se muestren en la bandeja
// del sistema operativo (junto a WhatsApp, Instagram, etc.) en vez de
// quedar encerradas dentro de la pestana del navegador.
//
// IMPORTANTE: subi este archivo a la MISMA carpeta que index.html en tu
// hosting. Si no esta en el mismo lugar, la app va a seguir funcionando
// pero sin notificaciones a nivel sistema (solo la campanita interna).

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

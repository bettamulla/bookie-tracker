const CACHE = 'mbt-cache-v3-e4cf20';
const ASSETS = [
  './','./index.html','./manifest.webmanifest','./sw.js',
  './icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(e.request.method==='GET'&&(url.origin===location.origin||/cdnjs\.cloudflare\.com/.test(url.origin))){
      const clone=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request, clone)).catch(()=>{});
    }
    return resp;
  }).catch(()=>r)));
});

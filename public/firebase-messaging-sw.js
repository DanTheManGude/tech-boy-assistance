importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBiAkIpR5tdOGIs_24RiuPUHQCejb9y4Zc",
  authDomain: "tech-boy-assistance.firebaseapp.com",
  databaseURL: "https://tech-boy-assistance-default-rtdb.firebaseio.com",
  projectId: "tech-boy-assistance",
  storageBucket: "tech-boy-assistance.appspot.com",
  messagingSenderId: "293043360816",
  appId: "1:293043360816:web:60969c6a3f4d08d5ef09f5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  navigator.setAppBadge(payload.data.fullMessagCount);
});

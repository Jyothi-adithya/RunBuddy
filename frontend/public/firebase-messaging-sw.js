importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDEVpRa9KGFiHjDz3SuQ7ePEyp5ctW2d4k",
  authDomain: "runbuddy-73ec6.firebaseapp.com",
  projectId: "runbuddy-73ec6",
  storageBucket: "runbuddy-73ec6.firebasestorage.app",
  messagingSenderId: "959475861548",
  appId: "1:959475861548:web:5b5b74e3d9882c05ea2989"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "RunBuddy";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message!",
    icon: "/logo192.png"
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
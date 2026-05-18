import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDEVpRa9KGFiHjDz3SuQ7ePEyp5ctW2d4k",
  authDomain: "runbuddy-73ec6.firebaseapp.com",
  projectId: "runbuddy-73ec6",
  storageBucket: "runbuddy-73ec6.firebasestorage.app",
  messagingSenderId: "959475861548",
  appId: "1:959475861548:web:5b5b74e3d9882c05ea2989",
  measurementId: "G-11LX94N46J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// 🔥 Request FCM Token + Send to Backend
export const requestFCMToken = async (api) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BGYvgQMFe0ns_QqIEqB2o7M6cidXlwDv3mEr7rNAtNk14bVbpN1v5c2BnzwXvoI7ZMeiGUfaTPj_v38G1lwGNLM"
      });

      await api.post("/profiles/fcm-token", { token });
      console.log("✅ FCM Token successfully registered with backend!");
      return token;
    } else {
      console.log("Notification permission denied");
    }
  } catch (err) {
    console.error("FCM Error:", err);
  }
};

// Show toast when app is open (foreground messages)
export const onForegroundMessage = (callback) => {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
};
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { checkUserProfileExists } from "@/services/firebaseFunctions";
import { auth, db } from "@/services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// ✅ Correct hook definition — but not just a fire-and-forget
export const useAuthCheck = (onComplete: (route: string, theme?: string) => void) => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkAuth = async () => {
      const netState = await NetInfo.fetch();

      if (!netState.isConnected) {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        const cachedProfile = await AsyncStorage.getItem("userProfile");

        if (isLoggedIn === "true" && cachedProfile) {
          const profile = JSON.parse(cachedProfile);
          onComplete("/home", profile.moodTheme);
        } else {
          onComplete("/auth/login");
        }
        return;
      }

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profileExists = await checkUserProfileExists();
          if (profileExists) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const profile = userDoc.data();
            if (profile) {
              await AsyncStorage.setItem("isLoggedIn", "true");
              await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
              onComplete("/home", profile.moodTheme);
            }
          } else {
            onComplete("/auth/profile-setup");
          }
        } else {
          await AsyncStorage.setItem("isLoggedIn", "false");
          onComplete("/auth/login");
        }
      });
    };

    checkAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onComplete]); // <- you should pass this in as stable
};

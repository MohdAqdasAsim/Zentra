import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import uuid from "react-native-uuid";
import { auth, db } from "./firebaseConfig";
import { Alert } from "react-native";
import { FirebaseError } from "firebase/app";

// Sign Up function
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Optional: Sign the user out to force re-login after verification
    await auth.signOut();

    return {
      success: true,
      message: "Verification email sent. Please verify your email!",
    };
  } catch (error: any) {
    let message = "Something went wrong. Please try again.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already in use. Try logging in instead.";
          break;
        case "auth/invalid-email":
          message = "The email address is not valid.";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters.";
          break;
        case "auth/operation-not-allowed":
          message = "Sign-up is disabled for this project.";
          break;
        default:
          message = error.message;
      }
    }

    return {
      success: false,
      message,
    };
  }
};

// Log In function
export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Refresh the user's auth state
    await user.reload();

    const isUserEmailVerified = user.emailVerified;

    if (!isUserEmailVerified) {
      await auth.signOut();
      return {
        success: false,
        message: "Please verify your email before logging in.",
        isUserEmailVerified: isUserEmailVerified
      };
    }

    return { success: true, message: "Login successful!", isUserEmailVerified: isUserEmailVerified };
  } catch (error: any) {
    let message = "Something went wrong. Please try again.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-credential":
          message = "No user found with this email address or incorrect password.";
          break;
        case "auth/user-not-found":
          message = "No user found with this email address.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          message = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          message = "Too many login attempts. Please try again later.";
          break;
        case "auth/operation-not-allowed":
          message = "Login is disabled for this project.";
          break;
        default:
          message = error.message;
      }
    }

    return {
      success: false,
      message,
    };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong." };
  }
};

// Firebase logout function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    Alert.alert("Logout Failed", "There was an error while logging out.");
  }
};

// Save Full Profile Function
export const saveUserProfile = async (profileData: {
  name: string;
  age: number,
  profileImage?: string;
  pronouns?: string;
  tonePreference?: string;
  emotionalReason?: string;
  checkInFrequency?: string;
  preferredTime?: string;
  avoidTopics?: string;
  plan: "free" | "premium";
}) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        success: false,
        message: "No user is currently signed in.",
      };
    }

    await currentUser.reload();

    if (!currentUser.emailVerified) {
      return {
        success: false,
        message: "Please verify your email before setting up your profile.",
      };
    }

    const userId = currentUser.uid;
    const uniqueId = uuid.v4() as string;

    const profile = {
      ...profileData,
      email: currentUser.email,
      uniqueId,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userId), profile);

    return {
      success: true,
      message: "Profile setup complete!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};

export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const docRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const updateUserField = async (field: string, value: any) => {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(db, "users", user.uid);
  await updateDoc(docRef, {
    [field]: value,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserProfile = async (profileData:any) => {
  const user = auth.currentUser;
  if (!user) return;
  await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
};

export const checkUserProfileExists = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  const profileRef = doc(db, "users", currentUser.uid);
  const profileSnap = await getDoc(profileRef);
  return profileSnap.exists();
};

type Message = { from: "user" | "ai"; text: string };

// Function to store the conversation in Firebase
export const storeConversation = async (conversationTitle: string, messages: Message[]) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        success: false,
        message: "No user is currently signed in.",
      };
    }

    const userId = currentUser.uid;
    const conversationId = uuid.v4() as string;  // Generate unique conversation ID

    // Create conversation data to be stored
    const conversationData = {
      title: conversationTitle,
      conversationId,
      messages,
      userId,
      timestamp: serverTimestamp(),
    };

    // Store the conversation in the user's document under 'conversations'
    await setDoc(doc(db, "users", userId, "conversations", conversationId), conversationData);

    return {
      success: true,
      message: "Conversation stored successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};

export const fetchUserConversations = async () => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        success: false,
        message: "No user is currently signed in.",
        data: [],
      };
    }

    const userId = currentUser.uid;
    const conversationsRef = collection(db, "users", userId, "conversations");
    const snapshot = await getDocs(conversationsRef);

    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: conversations,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch conversations.",
      data: [],
    };
  }
};

interface Conversation {
  id: string;
  conversationId: string;
  messages: { from: string; text: string }[];  // Adjust this to match your actual message structure
  timestamp: { seconds: number; nanoseconds: number }; // Firestore timestamp format
  title: string;
  userId: string;
}

export const fetchConversationById = async (conversationId: string): Promise<{ success: boolean; data: Conversation | null; message?: string }> => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return { success: false, message: 'No user is currently signed in.', data: null };
    }

    const userId = currentUser.uid;
    const docRef = doc(db, "users", userId, "conversations", conversationId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      
      // Assuming the data structure looks like the 'Conversation' interface
      const conversation: Conversation = {
        id: docSnapshot.id,
        conversationId: data?.conversationId || '',
        messages: data?.messages || [],
        timestamp: data?.timestamp || { seconds: 0, nanoseconds: 0 },
        title: data?.title || '',
        userId: data?.userId || '',
      };

      return { success: true, data: conversation };
    } else {
      return { success: false, message: 'Conversation not found.', data: null };
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch conversation.', data: null };
  }
};

export const updateConversation = async (conversationId: string, updatedMessages: any[]) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return { success: false, message: 'No user is currently signed in.', data: null };
    }

    const userId = currentUser.uid;
    const docRef = doc(db, "users", userId, "conversations", conversationId);

    await updateDoc(docRef, {
      messages: updatedMessages,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error:any) {
    console.error("Failed to update conversation:", error);
    return { success: false, message: error.message };
  }
};

export const deleteConversation = async (conversationId: string) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    await deleteDoc(doc(db, `users/${userId}/conversations`, conversationId));

    return { success: true };
  } catch (error:any) {
    console.error("Error deleting conversation:", error);
    return { success: false, message: error.message };
  }
};

// Journal Entry Type
export interface JournalEntry {
  journalId: string;
  title: string;
  content: string;
  mood?: string; // optional field for emotional context
  createdAt: any;
  updatedAt?: any;
}

// ✅ Create/Save a new journal entry
export const saveJournalEntry = async (
  title: string,
  content: string,
  mood?: string
) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is currently signed in.");

    const userId = currentUser.uid;
    const journalId = uuid.v4() as string;

    const journalData: JournalEntry = {
      journalId,
      title,
      content,
      mood,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userId, "journals", journalId), journalData);

    return { success: true, message: "Journal saved successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// 📥 Fetch all journal entries
export const fetchUserJournals = async (): Promise<{ success: boolean; data: JournalEntry[]; message?: string }> => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        success: false,
        message: "No user is currently signed in.",
        data: [],
      };
    }

    const userId = currentUser.uid;
    const journalsRef = collection(db, "users", userId, "journals");
    const snapshot = await getDocs(journalsRef);

    const journals: JournalEntry[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        journalId: docSnap.id,
        title: data.title || "Untitled",
        content: data.content || "",
        createdAt: data.createdAt || null,
      };
    });

    return {
      success: true,
      data: journals,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch journals.",
      data: [],
    };
  }
};

// 📌 Fetch a specific journal by ID
export const fetchJournalById = async (journalId: string) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is currently signed in.");

    const userId = currentUser.uid;
    const journalRef = doc(db, "users", userId, "journals", journalId);
    const snapshot = await getDoc(journalRef);

    if (snapshot.exists()) {
      return { success: true, data: snapshot.data() as JournalEntry };
    } else {
      return { success: false, message: "Journal not found.", data: null };
    }
  } catch (error: any) {
    return { success: false, message: error.message, data: null };
  }
};

// ✏️ Update a journal entry
export const updateJournalEntry = async (
  journalId: string,
  updatedFields: Partial<JournalEntry>
) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is currently signed in.");

    const userId = currentUser.uid;
    const journalRef = doc(db, "users", userId, "journals", journalId);

    await updateDoc(journalRef, {
      ...updatedFields,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Journal updated successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// 🗑 Delete a journal entry
export const deleteJournalEntry = async (journalId: string) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is currently signed in.");

    const userId = currentUser.uid;
    const journalRef = doc(db, "users", userId, "journals", journalId);

    await deleteDoc(journalRef);

    return { success: true, message: "Journal deleted successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const saveThoughtToFirestore = async (
  negativeThought: string,
  guidance: string,
  reframedThought: string
) => {
  try {
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    const userRef = doc(db, "users", user.uid);
    const thoughtsCollection = collection(userRef, "thoughts");

    const newThought = {
      negativeThought,
      guidanceQuestions: guidance,
      reframedThought,
      createdAt: new Date(),
    };

    await setDoc(doc(thoughtsCollection), newThought);
    return true;
  } catch (error) {
    console.error("Failed to save thought:", error);
    return false;
  }
};

export const fetchUserThoughts = async () => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        success: false,
        message: "No user is currently signed in.",
        data: [],
      };
    }

    const userId = currentUser.uid;
    const thoughtsRef = collection(db, "users", userId, "thoughts");
    const snapshot = await getDocs(thoughtsRef);

    const thoughts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: thoughts,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch thoughts.",
      data: [],
    };
  }
};

export const deleteThought = async (thoughtId: string) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return { success: false, message: "No user is currently signed in." };
    }

    const userId = currentUser.uid;
    const thoughtRef = doc(db, "users", userId, "thoughts", thoughtId);

    await deleteDoc(thoughtRef);

    return { success: true, message: "Thought deleted successfully." };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete thought." };
  }
};
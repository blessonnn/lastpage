import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  writeBatch 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

/**
 * Utility to compress image before upload (Returns Base64 Data URL)
 */
const compressImage = async (dataUrl, maxWidth = 800, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUrl;
    img.onerror = () => reject(new Error("Could not load image for compression"));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Return highly compressed base64 string directly
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
  });
};

const ENTRIES_COLLECTION = "entries";

/**
 * Fetch all entries from Firestore
 */
export const getAllEntries = async () => {
  try {
    const q = query(collection(db, ENTRIES_COLLECTION), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return [];
  }
};

/**
 * Submit a new entry to Firestore
 */
export const submitEntry = async (entryData) => {
  try {
    let photoData = entryData.photo;

    // 1. Handle Photo Upload: Compress Base64 locally to fit in Firestore 1MB limit
    if (entryData.photo && entryData.photo.startsWith('data:image')) {
      // Compress heavily (max 800px) so it easily fits within Firestore doc limit (~50KB)
      photoData = await compressImage(entryData.photo, 800, 0.6); 
    }

    // 2. Save directly to Firestore (Bypassing Firebase Storage constraints)
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      name: entryData.name,
      message: entryData.message,
      photo: photoData || null,
      voice: entryData.voice || null,
      submittedAt: serverTimestamp()
    });

    return { 
      id: docRef.id, 
      ...entryData, 
      photo: photoData,
      submittedAt: new Date().toISOString() 
    };
  } catch (error) {
    console.error("Submission failed:", error);
    throw error;
  }
};

/**
 * Update an existing entry
 */
export const updateEntry = async (id, updatedData) => {
  try {
    const docRef = doc(db, ENTRIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

/**
 * Delete an entry
 */
export const deleteEntry = async (id) => {
  try {
    const docRef = doc(db, ENTRIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
};

/**
 * Delete all entries (DANGER)
 */
export const deleteAllEntries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, ENTRIES_COLLECTION));
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("Error clearing collection:", error);
    throw error;
  }
};

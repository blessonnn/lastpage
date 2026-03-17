import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

/**
 * Utility to compress image before upload
 */
const compressImage = async (dataUrl, maxWidth = 1200, quality = 0.7) => {
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
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas to Blob conversion failed"));
        }
      }, 'image/jpeg', quality);
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
  console.log("Starting submission for:", entryData.name);
  
  // Timeout wrapper
  const timeout = (ms) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Request timed out. Please check your internet and Firebase Rules.")), ms)
  );

  const performSubmission = async () => {
    let photoUrl = entryData.photo;

    // 1. Handle Photo Upload if exists
    if (entryData.photo && entryData.photo.startsWith('data:image')) {
      console.log("Compressing image...");
      const compressedBlob = await compressImage(entryData.photo, 800, 0.6); // Shrink more for speed
      console.log("Uploading to Storage...");
      const storageRef = ref(storage, `photos/${Date.now()}_${entryData.name.replace(/\s+/g, '_')}.jpg`);
      await uploadBytes(storageRef, compressedBlob);
      photoUrl = await getDownloadURL(storageRef);
      console.log("Image uploaded:", photoUrl);
    }

    // 2. Save to Firestore
    console.log("Saving to Firestore...");
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      name: entryData.name,
      message: entryData.message,
      photo: photoUrl || null,
      submittedAt: serverTimestamp()
    });
    console.log("Document saved:", docRef.id);

    return { 
      id: docRef.id, 
      ...entryData, 
      photo: photoUrl,
      submittedAt: new Date().toISOString() 
    };
  };

  // Run with a 15-second cutoff
  try {
    return await Promise.race([performSubmission(), timeout(15000)]);
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

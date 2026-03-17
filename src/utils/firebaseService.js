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
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const ENTRIES_COLLECTION = "entries";

/**
 * Fetch all entries from Firestore
 */
export const getAllEntries = async () => {
  try {
    const q = query(collection(db, ENTRIES_COLLECTION), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to ISO string for compatibility with existing UI
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
};

/**
 * Submit a new entry to Firestore
 */
export const submitEntry = async (entryData) => {
  try {
    let photoUrl = entryData.photo;

    // If there's a base64 photo, upload it to Firebase Storage first
    if (entryData.photo && entryData.photo.startsWith('data:image')) {
      const storageRef = ref(storage, `photos/${Date.now()}_${entryData.name.replace(/\s+/g, '_')}`);
      await uploadString(storageRef, entryData.photo, 'data_url');
      photoUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      name: entryData.name,
      message: entryData.message,
      photo: photoUrl || null,
      submittedAt: serverTimestamp()
    });

    return { 
      id: docRef.id, 
      ...entryData, 
      photo: photoUrl,
      submittedAt: new Date().toISOString() 
    };
  } catch (error) {
    console.error("Error submitting entry:", error);
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

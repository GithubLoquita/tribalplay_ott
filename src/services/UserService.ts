import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import type { UserProfile } from '../types';

const COLLECTION_NAME = 'users';

export const UserService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { uid: snapshot.id, ...snapshot.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${uid}`);
      return null;
    }
  },

  async createProfile(profile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, profile.uid);
      await setDoc(docRef, profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${profile.uid}`);
    }
  },

  async updateMyList(uid: string, contentId: string, action: 'add' | 'remove'): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      await updateDoc(docRef, {
        myList: action === 'add' ? arrayUnion(contentId) : arrayRemove(contentId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${uid}`);
    }
  }
};

import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import type { WatchHistory } from '../types';

const COLLECTION_NAME = 'history';

export const HistoryService = {
  async saveProgress(userId: string, contentId: string, progress: number): Promise<void> {
    try {
      const historyId = `${userId}_${contentId}`;
      const docRef = doc(db, COLLECTION_NAME, historyId);
      await setDoc(docRef, {
        userId,
        contentId,
        progress,
        watchedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
    }
  },

  async getUserHistory(userId: string): Promise<WatchHistory[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('watchedAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as WatchHistory));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  }
};

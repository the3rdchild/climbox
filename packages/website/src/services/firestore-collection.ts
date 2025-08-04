import { db } from './firestore';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc
} from 'firebase/firestore';

export const collectionService = {
  getCollection: async (id: string) => {
    const snap = await getDoc(doc(db, 'collections', id));
    const data = snap.data();

    if (!data) {
      throw new Error('Collection not found');
    }

    // Hydrate with expected fields
    return {
      data: {
        id: snap.id,
        name: data.name ?? '',
        isPublic: data.isPublic ?? false,
        siteIds: data.siteIds ?? [],
        sites: [], // TODO: fetch sites if needed
      }
    };
  },

  getPublicCollection: async (id: string) => {
    const snap = await getDoc(doc(db, 'collections', id));
    const data = snap.data();

    if (!data) {
      throw new Error('Public collection not found');
    }

    return {
      data: {
        id: snap.id,
        name: data.name ?? '',
        isPublic: true,
        siteIds: data.siteIds ?? [],
        sites: [], // TODO: fetch sites if needed
      }
    };
  },

  getHeatStressCollection: async () => {
    // Dummy placeholder
    return {
      data: {
        id: 'dummy',
        name: 'Heat Stress',
        isPublic: true,
        siteIds: [],
        sites: [],
      }
    };
  },

  createCollection: async (
    name: string,
    isPublic: boolean,
    siteIds: string[]
  ) => {
    const docRef = await addDoc(collection(db, 'collections'), {
      name,
      isPublic,
      siteIds
    });
    return {
      data: {
        id: docRef.id,
        name,
        isPublic,
        siteIds
      }
    };
  },

  updateCollection: async (body: {
    id: string;
    name?: string;
    siteIds?: string[];
  }) => {
    await setDoc(doc(db, 'collections', body.id), body, { merge: true });
    return { ok: true };
  }
};

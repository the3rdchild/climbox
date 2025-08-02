import { initializeApp, type FirebaseOptions } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey:    import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:     import.meta.env.VITE_FIREBASE_APP_ID!
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// —— monitoringServices ——
export const monitoringServices = {
  getMonitoringStats: async (params: any) => {
    const snap = await getDocs(collection(db, "monitoring"));
    return { data: snap.docs.map(d => ({ id: d.id, ...d.data() })) };
  },
  // tambahkan method lain sesuai nama lama…
};

export const siteServices = {
  // sudah ada getSites, deleteSiteSurveyPoint
  registerSite: async (name: string, lat: number, lng: number, depth: number, token: string) => {
    const docRef = await addDoc(collection(db, "sites"), { name, lat, lng, depth, ownerToken: token });
    return { data: { site: { id: docRef.id } } };
  },
  getSite: async (id: string) => {
    const snap = await getDocs(collection(db, `sites/${id}`));
    return { data: snap.docs.map(d => ({ id: d.id, ...d.data() }))[0] };
  },
  updateSite: async (id: string, body: any, token: string) => {
    await setDoc(doc(db, `sites/${id}`), { ...body, updatedBy: token }, { merge: true });
    return { ok: true };
  },
  // …tambahkan method lain: getSiteUploadHistory, getSiteTimeSeriesData, deploySpotter, maintainSpotter, dll.
};

// —— surveyServices ——
export const surveyServices = {
  addSurvey: async (siteId: string, surveyData: any) => {
    const docRef = await addDoc(collection(db, `sites/${siteId}/surveys`), surveyData);
    return { data: { id: docRef.id, ...surveyData } };
  },
  updatePoi: async (pointId: string, data: any, token: string) => {
    await setDoc(doc(db, `surveyPoints/${pointId}`), { ...data, updatedBy: token }, { merge: true });
    return { ok: true };
  },
  // …
};

// —— uploadServices ——
export const uploadServices = {
  uploadMedia: async (formData: FormData, siteId: string) => {
    // contoh: simpan metadata, return dummy URL
    return { data: { url: "https://via.placeholder.com/150", thumbnailUrl: "" } };
  },
  deleteFileTimeSeriesData: async (siteId: string, params: any) => {
    // implement sesuai Firestore design
    return { ok: true };
  },
  // …
};

// —— userServices ——
export const userServices = {
  signInUser: async (email: string, pass: string) => {
    // gunakan firebase/auth kalau perlu
    return { user: { getIdToken: async () => "dummy-token" } };
  },
  getSelf: async () => {
    const snap = await getDocs(collection(db, "users"));
    return { data: snap.docs.map(d => d.data()) };
  },
  // createUser, storeUser, resetPassword, getAdministeredSites …
};

// —— collectionServices ——
export const collectionServices = {
  getCollections: async (token?: string) => {
    const snap = await getDocs(collection(db, "collections"));
    return { data: snap.docs.map(d => ({ id: d.id, ...d.data() })) };
  },
  updateCollection: async (body: any) => {
    await setDoc(doc(db, `collections/${body.id}`), body, { merge: true });
    return { ok: true };
  },
  // getPublicCollection, createCollection…
};


// —— mapServices (jika ada) ——
export const mapServices = {
  // misal reverseGeocode, getRegionBoundaries…
};

// … existing exports …
export const reefCheckService = {
  getReefCheckSurveys: async (siteId: string) => { /* … */ },
  getReefCheckSurvey:  async (siteId: string, surveyId: string) => { /* … */ },
};

// expose named helpers for legacy imports
export const getReefCheckSurveys = reefCheckService.getReefCheckSurveys;
export const getReefCheckSurvey  = reefCheckService.getReefCheckSurvey;


export default {
  collectionServices,
  mapServices,
  monitoringServices,
  reefCheckService,
  siteServices,
  surveyServices,
  uploadServices,
  userServices,
};
// src/services/firestore-survey.ts
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "./firestore";
  
export const surveyService = {
  getSurveys: async (siteId: string) => {
    const snap = await getDocs(collection(db, `sites/${siteId}/surveys`));
    return { data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
  },

  getSurvey: async (siteId: string, surveyId: string) => {
    const ref = doc(db, `sites/${siteId}/surveys`, surveyId);
    const snap = await getDoc(ref);
    return { data: snap.exists() ? { id: snap.id, ...snap.data() } : null };
  },

  addSurvey: async (siteId: string, surveyData: any) => {
    const ref = await addDoc(collection(db, `sites/${siteId}/surveys`), surveyData);
    return { data: { id: ref.id, ...surveyData } };
  },

  deleteSurvey: async (siteId: string, surveyId: string, token?: string) => {
    await deleteDoc(doc(db, `sites/${siteId}/surveys`, surveyId));
    return { ok: true };
  },

  addSurveyMedia: async (
    siteId: string,
    surveyId: string,
    media: any
  ) => {
    const ref = await addDoc(collection(db, `sites/${siteId}/surveys/${surveyId}/media`), media);
    return { data: { id: ref.id, ...media } };
  },

  addNewPoi: async (siteId: number, name: string, token?: string) => {
    await addDoc(collection(db, 'surveyPoints'), {
      siteId,
      name,
      token,
    });
    return { ok: true };
  },

  editSurveyMedia: async (
    siteId: string,
    mediaId: string,
    data: any,
    token?: string
  ) => {
    const ref = doc(db, `sites/${siteId}/surveysMedia`, mediaId);
    await updateDoc(ref, data);
    return { data: { id: mediaId, ...data } };
  },

  updatePoi: async (pointId: string, data: any, token?: string) => {
    const ref = doc(db, `surveyPoints/${pointId}`);
    await updateDoc(ref, data);
    return { ok: true };
  },
};
  
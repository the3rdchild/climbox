// src/services/firestore-reef-check.ts
import {
    collection,
    doc,
    getDoc,
    getDocs,
  } from "firebase/firestore";
  import { db } from "./firestore";
  import { ReefCheckSurvey } from 'store/ReefCheckSurveys/types';
  
  export const getReefCheckSurvey = async (
    siteId: string,
    surveyId: string
  ): Promise<{ data: ReefCheckSurvey }> => {
    const ref = doc(db, 'reefCheckSurveys', `${siteId}_${surveyId}`);
    const snap = await getDoc(ref);
  
    if (!snap.exists()) throw new Error('Reef Check Survey not found');
  
    return {
      data: { id: snap.id, ...(snap.data() as ReefCheckSurvey) },
    };
  };
  
// src/services/firestore-reef-check.ts
import {
    collection,
    doc,
    getDoc,
    getDocs,
  } from "firebase/firestore";
  import { db } from "./firestore";
  
  export const reefCheckService = {
    getReefCheckSurveys: async (siteId: string) => {
      const snap = await getDocs(collection(db, `sites/${siteId}/reefChecks`));
      return {
        data: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
      };
    },
  
    getReefCheckSurvey: async (siteId: string, surveyId: string) => {
      const snap = await getDoc(doc(db, `sites/${siteId}/reefChecks/${surveyId}`));
      return { data: snap.data() };
    },
  };
  
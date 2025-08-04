// src/services/firestore-site.ts
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "./firestore";
  
  export const siteService = {
    getSites: async () => {
      const snap = await getDocs(collection(db, "sites"));
      return { data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
    },
  
    getSite: async (id: string) => {
      const docRef = doc(db, "sites", id);
      const snap = await getDoc(docRef);
      return { data: snap.exists() ? { id: snap.id, ...snap.data() } : null };
    },
  
    registerSite: async (
      name: string,
      lat: number,
      lng: number,
      depth: number,
      token: string
    ) => {
      const siteRef = await addDoc(collection(db, "sites"), {
        name,
        latitude: lat,
        longitude: lng,
        depth,
        createdAt: new Date().toISOString(),
      });
      return {
        data: {
          site: { id: siteRef.id, name, latitude: lat, longitude: lng, depth },
        },
      };
    },
  
    updateSite: async (id: string, data: any, token?: string) => {
      const docRef = doc(db, "sites", id);
      await updateDoc(docRef, { ...data });
      return { ok: true };
    },
  
    getSiteDailyData: async (id: string) => {
      const snap = await getDocs(collection(db, `sites/${id}/dailyData`));
      return { data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
    },
  
    getSiteSurveyPoints: async (siteId: string) => {
      const q = query(collection(db, 'surveyPoints'), where('siteId', '==', Number(siteId)));
      const snap = await getDocs(q);
      return {
        data: snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: Number(doc.id),
            name: d.name,
          };
        }),
      };
    },
  
    deleteSiteSurveyPoint: async (siteId: string, pointId: string) => {
      await deleteDoc(doc(db, `sites/${siteId}/surveyPoints`, pointId));
      return { ok: true };
    },
  
    getSiteUploadHistory: async (siteId: string) => {
      const snap = await getDocs(collection(db, `sites/${siteId}/uploadHistory`));
      return { data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
    },
  
    getSiteForecastData: async (id: string) => {
      const snap = await getDocs(collection(db, `sites/${id}/forecastData`));
      return { data: { forecastData: snap.docs.map((d) => d.data()) } };
    },
  
    getSiteLatestData: async (id: string) => {
      const snap = await getDocs(collection(db, `sites/${id}/latestData`));
      return { data: { latestData: snap.docs.map((d) => d.data()) } };
    },
  
    getSiteSpotterPosition: async (id: string) => {
      const snap = await getDocs(collection(db, `sites/${id}/spotterPosition`));
      return { data: snap.docs.map((d) => d.data()) };
    },
  
    getOceanSenseData: async (params: any) => {
      const { siteId } = params;
      const snap = await getDocs(collection(db, `sites/${siteId}/oceanSenseData`));
      return { data: snap.docs.map((d) => d.data()) };
    },
  
    getSiteTimeSeriesData: async (params: any) => {
      const { siteId } = params;
      const snap = await getDocs(collection(db, `sites/${siteId}/timeSeriesData`));
      return { data: snap.docs.map((d) => d.data()) };
    },
  
    getSiteTimeSeriesDataRange: async (params: any) => {
      console.warn("TODO: implement getSiteTimeSeriesDataRange");
      return { data: [] };
    },
  
    getSiteContactInfo: async (params: any) => {
      const snap = await getDocs(collection(db, `sites/${params.siteId}/contactInfo`));
      return { data: { contactInformation: snap.docs.map((d) => d.data()) } };
    },
  
    deploySpotter: async (siteId: string, data: any, token: string) => {
      await setDoc(doc(db, `sites/${siteId}/spotterDeployment`, "deployment"), data);
      return { ok: true };
    },
  
    maintainSpotter: async (siteId: string, data: any, token: string) => {
      await setDoc(doc(db, `sites/${siteId}/spotterMaintenance`, "maintain"), data);
      return { ok: true };
    },
  
    applySite: async (siteId: string, appId: string, data: any, token: string) => {
      await setDoc(doc(db, `sites/${siteId}/applications`, appId), data);
      return { ok: true };
    },
  
    getSiteApplication: async (siteId: string, token: string) => {
      const snap = await getDocs(collection(db, `sites/${siteId}/applications`));
      return { data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
    },
  };
  
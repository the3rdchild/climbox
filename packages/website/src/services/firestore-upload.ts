// src/services/firestore-upload.ts
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    setDoc,
  } from "firebase/firestore";
  import { db } from "./firestore";
  
  export const uploadService = {
    uploadMedia: async (formData: FormData, siteId: string, token?: string) => {
      // NOTE: Tidak bisa langsung upload ke Firestore dari FormData.
      // Biasanya FormData → Firebase Storage, lalu URL-nya disimpan di Firestore.
      // Di sini sementara kita hanya simulasikan respons.
      return {
        data: {
          url: "https://via.placeholder.com/600x400",
          thumbnailUrl: "https://via.placeholder.com/300x200",
        },
      };
    },
  
    deleteFileTimeSeriesData: async (
      siteId: string,
      params: { ids: string[] },
      token?: string
    ) => {
      for (const id of params.ids) {
        await deleteDoc(doc(db, `sites/${siteId}/timeSeries`, id));
      }
      return { ok: true };
    },
  
    uploadTimeSeriesData: async (
      body: any,
      siteId: string,
      pointId: string,
      validate: boolean,
      siteTimezone: string,
      token?: string
    ) => {
      const ref = await addDoc(collection(db, `sites/${siteId}/timeSeries`), {
        ...body,
        pointId,
        siteTimezone,
        validated: validate,
      });
      return { data: { id: ref.id } };
    },
  
    uploadMultiSiteTimeSeriesData: async (
      files: File[],
      source: string,
      timezone: string,
      token?: string,
      validate?: boolean
    ) => {
      // TODO: implement actual upload logic
      return { data: files.map((f) => ({ name: f.name, status: "uploaded" })) };
    },
  };
  
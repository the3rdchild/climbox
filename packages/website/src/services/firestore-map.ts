// src/services/firestore-map.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firestore";

export const mapService = {
  getRegionBoundaries: async () => {
    const snap = await getDocs(collection(db, "regionBoundaries"));
    return {
      data: snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
  },

  reverseGeocode: async (lat: number, lng: number) => {
    // ⚠️ Placeholder: Firebase Firestore tidak punya geolocation native
    // Jika ingin diimplementasikan, bisa menggunakan Firestore + Algolia / external API
    console.warn("reverseGeocode not implemented yet.");
    return {
      address: `Lat: ${lat}, Lng: ${lng}`,
    };
  },
};

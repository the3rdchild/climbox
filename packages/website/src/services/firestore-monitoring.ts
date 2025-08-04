// src/services/firestore-monitoring.ts
import { db } from './firestore';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { MonitoringMetric } from 'utils/types';

// ✅ DONE: getMonitoringStats
// ✅ TODO: getMonitoringStatsCSV
// ✅ DONE: getSitesOverview
// ✅ DONE: getMonitoringLastMonth
// ✅ TODO: getSitesStatus
// ✅ TODO: getSurveysReport

export const monitoringService = {
  postMonitoringMetric: async ({
    token,
    siteId,
    metric,
  }: {
    token: string;
    siteId: number;
    metric: MonitoringMetric;
  }) => {
    // Buat dokumen baru dalam koleksi `monitoringMetrics`
    await addDoc(collection(db, 'monitoringMetrics'), {
      timestamp: new Date().toISOString(),
      siteId,
      metric,
      token, // bisa dihapus jika tidak disimpan di Firestore
    });
    return { ok: true };
  },

  getSitesOverview: async ({ token }: { token?: string }) => {
    const snap = await getDocs(collection(db, "sites"));
  
    return {
      data: snap.docs.map((doc) => {
        const d = doc.data();
        return {
          siteId: Number(doc.id), // assuming doc.id is numeric (otherwise parseInt)
          siteName: d.siteName ?? null,
          depth: d.depth ?? null,
          status: d.status ?? 'inactive', // default if missing
          organizations: d.organizations ?? [],
          adminNames: d.adminNames ?? [],
          adminEmails: d.adminEmails ?? [],
          spotterId: d.spotterId ?? null,
          videoStream: d.videoStream ?? null,
          updatedAt: d.updatedAt ?? new Date().toISOString(),
          lastDataReceived: d.lastDataReceived ?? null,
          surveysCount: d.surveysCount ?? 0,
          contactInformation: d.contactInformation ?? null,
          createdAt: d.createdAt ?? new Date().toISOString(),
        };
      }),
    };
  },

  // contoh implementasi dasar
  getMonitoringStats: async ({
    token,
    siteId,
    monthly,
    start,
    end,
    spotterId,
  }: {
    token?: string;
    siteId?: string;
    spotterId?: string;
    start?: string;
    end?: string;
    monthly?: boolean;
  }) => {
    // Query dapat disesuaikan nanti, untuk sekarang return dummy data:
    return {
      data: [
        {
          siteId: siteId || 'site_1',
          siteName: 'Test Site',
          data: [
            {
              date: new Date().toISOString(),
              totalRequests: 12,
              registeredUserRequests: 5,
              siteAdminRequests: 4,
              timeSeriesRequests: 2,
              CSVDownloadRequests: 1,
            },
          ],
        },
      ],
    };
  },

  // TODO: Simpan CSV di Firebase Storage jika perlu
  getMonitoringStatsCSV: async (params: any): Promise<void> => {
    console.warn("TODO: implement getMonitoringStatsCSV");
    // Kamu bisa simpan file CSV ke Firebase Storage di sini nantinya
  },

  getMonitoringLastMonth: async ({ token }: { token?: string }) => {
    const snap = await getDocs(collection(db, "monitoring"));
    return {
      data: snap.docs.map(d => {
        const doc = d.data();
        return {
          siteId: doc.siteId,
          siteName: doc.siteName,
          data: doc.data ?? [],
        };
      }),
    };
  },
  

  getSitesStatus: async ({ token }: { token?: string }): Promise<{ data: GetSitesStatusResponse }> => {
    const snap = await getDocs(collection(db, "sitesStatus"));
  
    // NOTE: asumsi hanya 1 dokumen, bisa diperluas jika perlu
    const doc = snap.docs[0];
    const d = doc.data();
  
    return {
      data: {
        totalSites: d.totalSites ?? 0,
        deployed: d.deployed ?? 0,
        displayed: d.displayed ?? 0,
        maintenance: d.maintenance ?? 0,
        shipped: d.shipped ?? 0,
        endOfLife: d.endOfLife ?? 0,
        lost: d.lost ?? 0,
      },
    };
  },

  getSurveysReport: async ({ token }: { token?: string }): Promise<{ data: GetSurveysReportResponse }> => {
    const snap = await getDocs(collection(db, "surveysReport"));
    const data = snap.docs.map((d) => d.data());
    return {
      data: data as GetSurveysReportResponse, // atau validasi secara eksplisit jika perlu
    };
  }
};

export type MonitoringData = {
  date: string;
  totalRequests: number;
  registeredUserRequests: number;
  siteAdminRequests: number;
  timeSeriesRequests: number;
  CSVDownloadRequests: number;
};

export type GetMonitoringMetricsResponse = {
  siteId: string;
  siteName: string;
  data: MonitoringData[];
}[];

export type GetSitesStatusResponse = {
  totalSites: number;
  deployed: number;
  displayed: number;
  maintenance: number;
  shipped: number;
  endOfLife: number;
  lost: number;
};

export type GetSurveysReportResponse = {
  siteId: string;
  siteName: string;
  diveDate: string;
  surveyId: string;
  updatedAt: string;
  surveyMediaCount: number;
  userEmail: string;
  userFullName: string;
}[];
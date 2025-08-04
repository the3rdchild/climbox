import { Site, SiteResponse } from '../Sites/types';
import { User } from '../User/types';

export interface CollectionSummary {
  id: string; // was: number
  name: string;
  isPublic: boolean;
  userId: string; // was: number
  siteIds: string[]; // was: number[]
}

export interface CollectionDetails {
  id: string;
  name: string;
  isPublic: boolean;
  sites: Site[];
  user?: User;
  siteIds: string[];
}

export interface CollectionDetailsResponse extends CollectionDetails {
  sites: SiteResponse[];
}

export interface CollectionRequestParams {
  id?: string; // was: number
  isHeatStress?: boolean;
  isPublic?: boolean;
  token?: string;
}

export interface CollectionUpdateParams {
  id: string;
  name?: string;
  addSiteIds?: string[];
  removeSiteIds?: string[];
}

export interface CollectionState {
  details?: CollectionDetails;
  loading: boolean;
  error?: string | null;
}

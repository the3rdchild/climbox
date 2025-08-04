import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAxiosErrorMessage } from 'helpers/errors';
import { collectionService } from 'services/firestore';
import { CollectionState, CollectionRequestParams } from './types';
import type { CreateAsyncThunkTypes, RootState } from '../configure';
import { constructCollection } from './utils';

const collectionInitialState: CollectionState = {
  loading: false,
  error: null,
};

const collectionRequest = createAsyncThunk<
  CollectionState['details'],
  CollectionRequestParams,
  CreateAsyncThunkTypes
>(
  'collection/request',
  async ({ id, isHeatStress, isPublic }, { rejectWithValue }) => {
    try {
      if (isHeatStress && !id) {
        const { data } = await collectionService.getHeatStressCollection();
        return constructCollection(data);
      }

      if (id) {
        const { data } = isPublic
          ? await collectionService.getPublicCollection(id)
          : await collectionService.getCollection(id);
        return constructCollection(data); // ✅ NO ERROR
      }

      return undefined;
    } catch (err) {
      return rejectWithValue(getAxiosErrorMessage(err));
    }
  }
);

const collectionSlice = createSlice({
  name: 'collection',
  initialState: collectionInitialState,
  reducers: {
    clearCollection: (state) => ({ ...state, details: undefined }),
    setName: (state, action: PayloadAction<string>) => ({
      ...state,
      details: state.details
        ? { ...state.details, name: action.payload }
        : state.details,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(
      collectionRequest.fulfilled,
      (state, action: PayloadAction<CollectionState['details']>) => ({
        ...state,
        details: action.payload,
        loading: false,
      }),
    );

    builder.addCase(
      collectionRequest.rejected,
      (state, action: PayloadAction<CollectionState['error']>) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    );

    builder.addCase(collectionRequest.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }));
  },
});

export const collectionDetailsSelector = (
  state: RootState,
): CollectionState['details'] => state.collection.details;

export const collectionLoadingSelector = (
  state: RootState,
): CollectionState['loading'] => state.collection.loading;

export const collectionErrorSelector = (
  state: RootState,
): CollectionState['error'] => state.collection.error;

export const { clearCollection, setName } = collectionSlice.actions;

export default collectionSlice.reducer;

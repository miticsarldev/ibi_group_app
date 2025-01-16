import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { trajet } from '@/interface/trajet';

interface TrajetState {
  trajets: trajet[];
  loading: boolean;
  error: string | null;
}

const initialState: TrajetState = {
  trajets: [],
  loading: false,
  error: null,
};

const trajetSlice = createSlice({
  name: 'trajet',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setTrajets(state, action: PayloadAction<trajet[]>) {
      state.trajets = action.payload;
    },
    updateTrajetStatut(state, action: PayloadAction<{ id: string; statut: "diponible" | "accepter" | "refuser" }>) {
      const { id, statut } = action.payload;
      const trajet = state.trajets.find((t) => t.id === id);
      if (trajet) {
        trajet.statut = statut;
      }
    },
  },
});

export const { setLoading, setError, setTrajets, updateTrajetStatut } = trajetSlice.actions;
export default trajetSlice.reducer;
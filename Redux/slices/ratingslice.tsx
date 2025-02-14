
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tripId: null, 
  isModalVisible: true,
}; 

const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
      showRatingModal: (state, action) => {
        console.log('Reducer: showRatingModal déclenché, tripId:', action.payload.tripId);
        state.tripId = action.payload.tripId;
        state.isModalVisible = true;
      },
      hideRatingModal: (state) => {
        console.log('Reducer: hideRatingModal déclenché');
        state.tripId = null;
        state.isModalVisible = false;
      },
    },
  });

export const { showRatingModal, hideRatingModal } = ratingSlice.actions;
export default ratingSlice.reducer;
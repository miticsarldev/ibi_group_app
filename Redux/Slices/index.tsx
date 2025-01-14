import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customModalVisible: false,
  priceModalVisible: false,
  payModalVisible: false,
  selectedDestination: null,
  selectedType: null,
  selectedPrice: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleCustomModal: (state) => {
      state.customModalVisible = !state.customModalVisible;
    },
    togglePriceModal: (state) => {
      state.priceModalVisible = !state.priceModalVisible;
    },
    togglePayModal: (state) => {
      state.payModalVisible = !state.payModalVisible;
    },
    setDestination: (state, action) => {
      state.selectedDestination = action.payload;
    },
    setTypeAndPrice: (state, action) => {
      state.selectedType = action.payload.type;
      state.selectedPrice = action.payload.price;
    },
  },
});

export const {
  toggleCustomModal,
  togglePriceModal,
  togglePayModal,
  setDestination,
  setTypeAndPrice,
} = modalSlice.actions;

export default modalSlice.reducer;

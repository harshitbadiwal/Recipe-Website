import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedItem: ['recipes-all'],
  selectedID: null,
  drawerOpen: true,
  error: null,
};

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.selectedItem = action.payload;
    },
    activeID(state, action) {
      state.selectedID = action.payload;
    },
    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export default menu.reducer;

export const { activeItem, activeID, openDrawer, hasError } = menu.actions;

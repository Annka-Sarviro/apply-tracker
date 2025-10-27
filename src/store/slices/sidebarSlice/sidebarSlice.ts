import { resetStore } from "@/store/resetStore";
import { createSlice } from "@reduxjs/toolkit";

interface ISidebarState {
  isSidebarOpen: boolean;
}

const sidebarInitialState: ISidebarState = {
  isSidebarOpen: true,
};

const sidebarSlice = createSlice({
  name: "Sidebar",
  initialState: sidebarInitialState,
  reducers: {
    openSidebar: (state) => void (state.isSidebarOpen = true),
    closeSidebar: (state) => void (state.isSidebarOpen = false),
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => sidebarInitialState);
  },
});

export const { openSidebar, closeSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;

import { resetStore } from "@/store/resetStore";
import { createSlice } from "@reduxjs/toolkit";

interface ISearchState {
  isSearchOpen: boolean;
  isDropdownShown: boolean;
}

const initialState: ISearchState = {
  isSearchOpen: false,
  isDropdownShown: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    showDropdown: (state) => {
      state.isDropdownShown = true;
    },
    hideDropdown: (state) => {
      state.isDropdownShown = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const {
  openSearch,
  closeSearch,
  toggleSearch,
  showDropdown,
  hideDropdown,
} = searchSlice.actions;
export default searchSlice.reducer;

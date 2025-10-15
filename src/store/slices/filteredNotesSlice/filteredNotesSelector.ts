import { RootState } from "../../store";

export const selectFilteredNotes = (state: RootState) => state.filteredNotes;
export const selectNotesSearchQuery = (state: RootState) =>
  state.filteredNotes.searchNotesQuery;
export const selectNotesSortType = (state: RootState) =>
  state.filteredNotes.sortNotesType;
export const selectNotesQuantity = (state: RootState) =>
  state.filteredNotes.filteredNotes.length;

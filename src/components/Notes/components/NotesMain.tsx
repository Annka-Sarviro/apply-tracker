import { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { useGetAllUserDataQuery } from "@/store/querySlices/profileQuerySlice";
import { useAppDispatch, useAppSelector, useFilteredNotes } from "@/store/hook";
import { selectfilteredNotes } from "@/store/slices/filteredNotesSlice/filteredNotesSelector";
import { setFilteredNotes } from "@/store/slices/filteredNotesSlice/filteredNotesSlice";

import NoteCardSceleton from "./NoteCardSceleton";
import NoteCard from "./NoteCard";
import NoVacancyCard from "@/components/Statistics/componets/statisticsPanel/NoVacancyCard";
import { Note } from "@/types/notes.types";

const NotesMain = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetAllUserDataQuery();

  const { sortNotesType, searchNotesQuery } =
    useAppSelector(selectfilteredNotes);

  const notes = data?.notes || [];

  const filteredNotes = useFilteredNotes(
    notes,
    searchNotesQuery,
    sortNotesType
  );

  const prevFilteredNotesRef = useRef<Note[]>([]);

  useEffect(() => {
    const hasChanged =
      prevFilteredNotesRef.current.length !== filteredNotes.length ||
      filteredNotes.some(
        (n, i) => n.id !== prevFilteredNotesRef.current[i]?.id
      );

    if (hasChanged) {
      prevFilteredNotesRef.current = filteredNotes;
      dispatch(setFilteredNotes(filteredNotes));
    }
  }, [dispatch, filteredNotes]);

  const isDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1919 });
  const isLargeDesktop = useMediaQuery({ minWidth: 1920 });

  let skeletonCount = 2;
  if (isDesktop) skeletonCount = 3;
  else if (isLargeDesktop) skeletonCount = 4;

  return (
    <div className="flex w-full flex-col justify-center gap-6 md:flex-row">
      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <NoteCardSceleton key={index} />
        ))}
      {isError && <h2 className="text-textBlack">Error...</h2>}
      {!isLoading && !isError && notes.length === 0 && <NoVacancyCard />}
      {!isLoading && !isError && notes.length > 0 && (
        <div className="grid w-full justify-center gap-6 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} {...note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesMain;

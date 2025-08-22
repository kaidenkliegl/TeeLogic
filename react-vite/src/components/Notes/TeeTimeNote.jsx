import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateLocalNote } from "../../redux/notes/noteSlice";
import { saveNote, fetchNote } from "../../redux/notes/noteThunks";
import "./TeeTimeNote.css"

export default function NoteEditor({ teeTimeId }) {
  const dispatch = useDispatch();
  const note = useSelector((state) => state.note.note);
  const [localContent, setLocalContent] = useState("");

  // Load note when component mounts
  useEffect(() => {
    dispatch(fetchNote(teeTimeId));
  }, [dispatch, teeTimeId]);

  // Keep local state in sync
  useEffect(() => {
    if (note?.content !== undefined) {
      setLocalContent(note.content);
    }
  }, [note]);

  // Debounce save
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localContent !== note?.content) {
        dispatch(saveNote({ teeTimeId, content: localContent }));
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [localContent, dispatch, teeTimeId, note?.content]);

  return (
    <textarea
      className="tee-time-note"
      value={localContent}
      onChange={(e) => {
        setLocalContent(e.target.value);
        dispatch(updateLocalNote(e.target.value));
      }}
      placeholder="Write notes for this tee time..."
    />
  );
}

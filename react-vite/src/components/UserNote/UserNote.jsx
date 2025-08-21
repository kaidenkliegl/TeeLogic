import React, { useState } from "react";
import "./Note.css";

export default function Note() {
  const [noteText, setNoteText] = useState("");

  return (
    <div className="note-container">
      <h3 className="user-note-header">Notes</h3>
      <textarea
        id="user-notes"
        name="user-notes"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Type your notes here..."
      />
    </div>
  );
}
import { createContext, useState } from "react";
export const NotesContext = createContext(null);
export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({});
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [tempName, setTempName] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const addNote = async () => {
    let note = {
      name: "NewNote",
      text: "",
    };
    try {
      const resp = await fetch("http://localhost:8000/api/createnote/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (resp.ok) {
        const data = await resp.json();
        setNotes((prev) => [...prev, { ...note, id: data.id }]);
        setCurrentNoteId(data.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async () => {
    try {
      const resp = await fetch("http://localhost:8000/api/deletenote/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentNoteId }),
      });
      if (resp.ok) {
        setCurrentNoteId(null);
        setNotes((prev) => prev.filter((note) => note.id !== currentNoteId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateNote = async () => {
    try {
      let note = { id: currentNoteId, name: tempName, text: tempValue };
      const resp = await fetch("http://localhost:8000/api/updatenote/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (resp.ok) {
        setIsEditing(false);
        setCurrentNote(note);
        setNotes((prev) =>
          prev.map((note) =>
            note.id === currentNoteId
              ? { ...note, name: tempName, text: tempValue }
              : note
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        currentNote,
        setCurrentNote,
        currentNoteId,
        setCurrentNoteId,
        tempName,
        setTempName,
        isEditing,
        setIsEditing,
        tempValue,
        setTempValue,
        addNote,
        deleteNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, NoteList, ListItem } from "./SidebarComponents";
import {
  Name,
  NameEditing,
  NoteText,
  NoteEditing,
  DeleteButton,
  EditButton,
} from "./NoteComponents";
import { NotesContext } from "../../context/NotesContext";
export function MainPage() {
  const [isOpened, setIsOpened] = useState(false);
  const {
    notes,
    currentNoteId,
    setCurrentNote,
    setNotes,
    setCurrentNoteId,
    isEditing,
  } = useContext(NotesContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch("http://localhost:8000/api/getnotes/", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (resp.ok) {
          const data = await resp.json();
          setNotes(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (notes.length > 0 && !currentNoteId) {
      setCurrentNoteId(notes[0].id);
      setCurrentNote(notes[0]);
    } else {
      const note = notes.find((note) => note.id === currentNoteId);
      if (note) {
        setCurrentNote(note);
      }
    }
  }, [notes, currentNoteId]);

  function changeNote(id) {
    if (id !== currentNoteId) {
      setCurrentNoteId(id);
      const note = notes.find((note) => note.id == id);
      setCurrentNote(note);
    }
  }

  return (
    <div className="container flex flex-col h-screen">
      <Sidebar onChange={(status) => setIsOpened(status)}>
        <NoteList>
          {notes.map((value) => (
            <ListItem
              name={value.name}
              id={value.id}
              key={value.id}
              onActive={changeNote}
            />
          ))}
        </NoteList>
      </Sidebar>
      <div
        className={`transition-all duration-300 h-[1100px] mt-[170px] ${
          isOpened ? "ml-40" : "ml-0"
        }`}
      >
        {notes.length > 0 ? (
          <>
            <div className="h-[30px]">
              {isEditing ? <NameEditing /> : <Name />}
            </div>
            <div className="flex justify-end mb-3 mt-5">
              <EditButton />
              <DeleteButton />
            </div>
            {isEditing ? <NoteEditing /> : <NoteText />}
          </>
        ) : (
          <div>You have no notes</div>
        )}
      </div>
    </div>
  );
}

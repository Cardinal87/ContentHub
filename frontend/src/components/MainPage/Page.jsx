import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  Name,
  EditButton,
  DeleteButton,
  NoteEditing,
  NoteText,
  NameEditing,
} from "./Components";
export function MainPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [name, setName] = useState("MyNote");
  const [tempName, setTempName] = useState(name);

  function saveText(value) {
    setIsEditing(false);
    setNoteText(value);
    setName(tempName);
  }

  return (
    <div className="container flex flex-col h-screen">
      <Sidebar onChange={(status) => setIsOpened(status)}></Sidebar>
      <div
        className={`transition-all duration-300 h-[70%] mt-[10%] ${
          isOpened ? "ml-40" : "ml-0"
        }`}
      >
        <div className="h-[8%]">
          {isEditing ? (
            <NameEditing
              name={tempName}
              onChange={(value) => setTempName(value)}
            />
          ) : (
            <Name name={name} />
          )}
        </div>
        <div className="flex justify-end mb-3 mt-2">
          <EditButton setIsEditing={setIsEditing} isEditing={isEditing} />
          <DeleteButton />
        </div>
        {isEditing ? (
          <NoteEditing
            text={noteText}
            onSave={saveText}
            onCancel={() => {
              setIsEditing(false);
            }}
          />
        ) : (
          <NoteText value={noteText}></NoteText>
        )}
      </div>
    </div>
  );
}

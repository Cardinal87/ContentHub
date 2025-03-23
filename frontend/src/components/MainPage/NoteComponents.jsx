import { useState, useRef, useEffect, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "./Icons";
import { replace } from "react-router-dom";
import { NotesContext } from "../../context/NotesContext";

export function NoteText() {
  const { currentNote } = useContext(NotesContext);
  return (
    <div className="container h-[90%]">
      <p
        className="w-4xl h-[90%] break-words text-gray-100 overflow-x-hidden overflow-y-auto text-left
                   bg-gray-600 border border-gray-500 rounded-xl shadow-xl p-3 whitespace-pre-wrap"
      >
        {currentNote.text}
      </p>
    </div>
  );
}

export function NoteEditing() {
  const { setIsEditing, tempValue, setTempValue } = useContext(NotesContext);
  function SaveValue(e) {
    setTempValue(e.target.value);
  }
  return (
    <div className="container flex flex-col h-[90%]">
      <textarea
        className=" h-[90%] w-4xl text-gray-100 resize-none bg-gray-700 border border-blue-300
                      rounded-xl shadow-xl p-3 transition-colors duration-300
                      outline-none focus:border-blue-700 hover:[&:not(:focus)]:border-blue-500
                      whitespace-pre-wrap"
        placeholder="your note"
        value={tempValue}
        onChange={SaveValue}
      />

      <div className="mt-2 flex justify-end">
        <button
          className="px-4 py-1.5 text-gray-400 hover:text-blue-500 transition-colors duration-300"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
        <SaveButton />
      </div>
    </div>
  );
}

function SaveButton() {
  const { updateNote } = useContext(NotesContext);

  return (
    <button
      className="px-4 py-1.5 bg-blue-600 text-gray-100 rounded-lg transition-colors
                              duration-300 hover:bg-blue-500 mx-2"
      onClick={updateNote}
    >
      Save
    </button>
  );
}

export function DeleteButton() {
  const { deleteNote } = useContext(NotesContext);

  return (
    <button
      className="border border-transparent rounded-lg transition-all duration-300"
      onClick={deleteNote}
    >
      <DeleteIcon />
    </button>
  );
}

export function EditButton() {
  const btnRef = useRef(null);
  const { isEditing, setIsEditing, setTempName, setTempValue, currentNote } =
    useContext(NotesContext);

  function onClick() {
    setTempName(currentNote.name);
    setTempValue(currentNote.text);
    setIsEditing((prev) => !prev);
  }

  return (
    <button
      onClick={onClick}
      ref={btnRef}
      className={`border ${
        isEditing ? "border-blue-600" : "border-transparent"
      } rounded-lg p-1 transition-colors duration-300`}
    >
      <EditIcon
        classes={
          "hover:fill-blue-500 transition-colors ease-in-out duration-200"
        }
      />
    </button>
  );
}

export function Name() {
  const { currentNote } = useContext(NotesContext);
  return (
    <div>
      <p className="text-2xl font-bold text-blue-400 text-left">
        {currentNote.name}
      </p>
    </div>
  );
}

export function NameEditing() {
  const { setTempName, tempName } = useContext(NotesContext);

  function onChange(e) {
    setTempName(e.target.value);
  }

  return (
    <div>
      <input
        value={tempName}
        className="w-4xl text-gray-100 bg-gray-700 border 
      border-blue-300 rounded-xl shadow-xl p-1 transition-colors duration-300
      outline-none focus:border-blue-700 hover:[&:not(:focus)]:border-blue-500"
        onChange={onChange}
      />
    </div>
  );
}

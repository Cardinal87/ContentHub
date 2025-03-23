import { useState, useRef, useEffect, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  LeftArrow,
  LogoutIcon,
  ProfileIcon,
  RightArrow,
  SettingsIcon,
} from "./Icons";
import { replace } from "react-router-dom";
import { NotesContext } from "../../context/NotesContext";

function SettingsButton() {
  return (
    <button
      className="flex text-gray-100 mx-3 text-0.5xl items-center hover:bg-gray-700
      py-2 rounded-lg px-1 transition-colors duration-300"
    >
      <SettingsIcon classes={"mr-3"}></SettingsIcon>
      Settings
    </button>
  );
}

function ProfileButton() {
  return (
    <button
      className={`flex text-gray-100 text-0.5xl items-center hover:bg-gray-700 
      transition-colors duration-300 justify-start py-2 px-1 rounded-lg mx-3`}
    >
      <ProfileIcon classes={"mr-3"}></ProfileIcon>
      Profile
    </button>
  );
}

function AddButton() {
  const { addNote } = useContext(NotesContext);

  return (
    <button
      className="flex border-0 bg-blue-600 hover:bg-blue-500 transition-colors 
      duration-300 rounded-xl p-1 mt-5 mr-2 mb-1 text-gray-100"
      onClick={addNote}
    >
      <span>Add note</span>
      <AddIcon />
    </button>
  );
}

function LogoutButton() {
  const navigate = useNavigate();

  async function logout() {
    try {
      const resp = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
      if (resp.ok) {
        navigate("login/", { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      className="flex text-gray-100 text-0.5xl items-center hover:bg-gray-700 
      transition-colors duration-300 justify-start py-2 pr-1 pl-0 rounded-lg mx-3"
      onClick={logout}
    >
      <LogoutIcon classes={"mr-3"} />
      Logout
    </button>
  );
}

export function Sidebar({ children, onChange, addNote }) {
  const [isOpened, setIsOpened] = useState(false);
  function changeSidebarState() {
    setIsOpened((prev) => !prev);
    onChange(!isOpened);
  }

  const sidebarContent = isOpened ? (
    <>
      <div className="flex flex-col mt-auto mb-4 items-stretch">
        <ProfileButton />
        <SettingsButton />
        <LogoutButton />
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col mt-auto mb-4 items-end">
        <ProfileIcon classes={"mr-2 my-2"} />
        <SettingsIcon classes={"mr-2.5 my-2"} />
        <button
          className="border-2 border-transparent rounded-lg p-1 hover:border-blue-600 mr-2 my-1
            transition-colors duration-300 text-center"
        >
          <LogoutIcon />
        </button>
      </div>
    </>
  );

  return (
    <aside
      className={`left-0 top-0 border-r-2 border-gray-500 bg-gray-900 fixed w-[250px] h-screen z-50
        transition-transform duration-400 flex flex-col ${
          isOpened ? `translate-0` : `-translate-x-49 `
        }`}
    >
      <div className="flex flex-col h-1/11 items-end justify-start">
        <button
          className="rounded-4xl border-2 border-transparent hover:border-blue-600 
            transition-colors duration-200 mt-4 mr-2"
          onClick={changeSidebarState}
        >
          {isOpened ? <LeftArrow /> : <RightArrow />}
        </button>
        {isOpened ? <AddButton onClick={addNote} /> : ""}
      </div>
      <hr className="text-gray-100"></hr>
      <div className="h-[920px]">{isOpened ? children : ""}</div>
      <hr className="text-gray-100"></hr>
      {sidebarContent}
    </aside>
  );
}

export function NoteList({ children }) {
  return (
    <ul
      className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800 h-[100%] 
    [&::-webkit-scrollbar-button]:hidden"
    >
      {children}
    </ul>
  );
}

export function ListItem({ name, onActive, id }) {
  const [isActive, setIsActive] = useState(false);
  const { currentNoteId } = useContext(NotesContext);
  useEffect(() => {
    if (id !== currentNoteId) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }, [currentNoteId]);

  return (
    <li
      className={`flex py-3 border-b hover:bg-gray-700 hover:border-blue-600
    transition-all duration-300 w-[100%] ${
      isActive
        ? "border-blue-600 bg-gray-800"
        : "border-gray-200 bg-gray-900 hover:-translate-y-1 ease-in-out transform"
    }`}
      key={id}
      onClick={() => onActive(id)}
    >
      <span className="truncate w-[80%] text-gray-400 text-left ml-1">
        {name}
      </span>
    </li>
  );
}

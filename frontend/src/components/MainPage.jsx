import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DeleteIcon,
  EditIcon,
  LeftArrow,
  LogoutIcon,
  ProfileIcon,
  RightArrow,
  SettingsIcon,
} from "./Icons";
import { replace } from "react-router-dom";

function NoteText() {
  return (
    <div className="container h-[960px]">
      <p
        className="w-4xl h-[900px] break-words text-gray-100 overflow-x-hidden overflow-y-auto text-left
                    bg-gray-600 border border-gray-500 rounded-xl shadow-xl p-3"
      >
        Text
      </p>
    </div>
  );
}

function NoteEditing() {
  return (
    <div className="container flex flex-col h-[960px]">
      <textarea
        className=" h-[900px] w-4xl text-gray-100 resize-none bg-gray-700 border border-blue-300
                    rounded-xl shadow-xl p-3 transition-colors duration-300
                    outline-none focus:border-blue-700 hover:[&:not(:focus)]:border-blue-500"
        placeholder="your note"
      >
        Text
      </textarea>
      <div className="mt-2 flex justify-end">
        <button className="px-4 py-1.5 text-gray-400 hover:text-blue-500 transition-colors duration-300">
          Cancel
        </button>
        <button
          className="px-4 py-1.5 bg-blue-600 text-gray-100 rounded-lg transition-colors
                            duration-300 hover:bg-blue-500 mx-2"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function DeleteButton() {
  return (
    <button className="border border-transparent rounded-lg transition-all duration-300">
      <DeleteIcon />
    </button>
  );
}

function EditButton({ isEditing, setEditing }) {
  const btnRef = useRef(null);
  function onClick() {
    setEditing((prev) => !prev);
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

function Name({ name }) {
  return (
    <div>
      <p className="text-2xl font-bold text-blue-400 text-left ">{name}</p>
    </div>
  );
}

function Sidebar({ children }) {
  const [isOpened, setIsOpened] = useState(false);
  function changeSidebarState() {
    setIsOpened((prev) => !prev);
  }

  if (isOpened)
    return (
      <aside
        className={`left-0 top-0 border-r-2 border-gray-500 bg-gray-900 fixed w-[250px] h-screen z-50
      transition-transform duration-400 flex flex-col`}
      >
        <div className="flex h-1/11 items-start justify-end">
          <button
            className="rounded-4xl border-2 border-transparent hover:border-blue-600 
          transition-colors duration-200 mt-4 mr-2"
            onClick={changeSidebarState}
          >
            <LeftArrow></LeftArrow>
          </button>
        </div>
        <hr className="text-gray-100"></hr>
        <div className="h-8/10">
          <ul></ul>
        </div>
        <hr className="text-gray-100"></hr>
        <div className="flex flex-col mt-3 mb-3 items-stretch">
          <ProfileButton />
          <SettingsButton />
          <LogoutButton />
        </div>
      </aside>
    );
  else {
    return (
      <aside
        className={`left-0 top-0 border-r-2 border-gray-500 bg-gray-900 fixed w-[250px] h-screen z-50
        transition-transform duration-400 flex flex-col -translate-x-49`}
      >
        <div className="flex h-1/11 items-start justify-end">
          <button
            className="rounded-4xl border-2 border-transparent hover:border-blue-600 
          transition-colors duration-200 mt-4 mr-2"
            onClick={changeSidebarState}
          >
            <RightArrow></RightArrow>
          </button>
        </div>
        <hr className="text-gray-100"></hr>
        <div className="h-8/10"></div>
        <hr className="text-gray-100"></hr>
        <div className="flex flex-col mt-auto mb-3 items-end">
          <ProfileIcon classes={"mr-2"} />
          <SettingsIcon classes={"mr-2.5 mt-2"} />
          <button
            className="border-2 border-transparent rounded-lg p-1 hover:border-blue-600 mr-2 mt-2
          transition-colors duration-300 text-center"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>
    );
  }
}

export function MainPage() {
  const [isEditing, setEditing] = useState(false);
  return (
    <div className="container flex flex-col">
      <Sidebar></Sidebar>
      <Name name={"note"}></Name>
      <div className="flex justify-end mb-3 mt-2">
        <EditButton setEditing={setEditing} isEditing={isEditing}></EditButton>
        <DeleteButton></DeleteButton>
      </div>
      {isEditing ? <NoteEditing></NoteEditing> : <NoteText></NoteText>}
    </div>
  );
}

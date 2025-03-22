import { useState, useRef } from "react";
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

export function NoteText({ value }) {
  return (
    <div className="container h-[90%]">
      <p
        className="w-4xl h-[90%] break-words text-gray-100 overflow-x-hidden overflow-y-auto text-left
                      bg-gray-600 border border-gray-500 rounded-xl shadow-xl p-3"
      >
        {value}
      </p>
    </div>
  );
}

export function NoteEditing({ text, onSave, onCancel }) {
  const [value, setValue] = useState(text);
  function SaveValue(e) {
    setValue(e.target.value);
  }
  return (
    <div className="container flex flex-col h-[90%]">
      <textarea
        className=" h-[90%] w-4xl text-gray-100 resize-none bg-gray-700 border border-blue-300
                      rounded-xl shadow-xl p-3 transition-colors duration-300
                      outline-none focus:border-blue-700 hover:[&:not(:focus)]:border-blue-500"
        placeholder="your note"
        value={value}
        onChange={SaveValue}
      />

      <div className="mt-2 flex justify-end">
        <button
          className="px-4 py-1.5 text-gray-400 hover:text-blue-500 transition-colors duration-300"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-1.5 bg-blue-600 text-gray-100 rounded-lg transition-colors
                              duration-300 hover:bg-blue-500 mx-2"
          onClick={() => onSave(value)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function DeleteButton() {
  return (
    <button className="border border-transparent rounded-lg transition-all duration-300">
      <DeleteIcon />
    </button>
  );
}

export function EditButton({ isEditing, setIsEditing }) {
  const btnRef = useRef(null);
  function onClick() {
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

export function Name({ name }) {
  return (
    <div>
      <p className="text-2xl font-bold text-blue-400 text-left">{name}</p>
    </div>
  );
}

export function NameEditing({ name, onChange }) {
  return (
    <div>
      <input
        value={name}
        className="w-4xl text-gray-100 bg-gray-700 border 
      border-blue-300 rounded-xl shadow-xl p-1 transition-colors duration-300
      outline-none focus:border-blue-700 hover:[&:not(:focus)]:border-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function Sidebar({ children, onChange }) {
  const [isOpened, setIsOpened] = useState(false);
  function changeSidebarState() {
    setIsOpened((prev) => !prev);
    onChange(!isOpened);
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
        <div className="h-[65%]">
          <ul></ul>
        </div>
        <hr className="text-gray-100"></hr>
        <div className="flex flex-col mt-auto mb-4 items-stretch">
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
        <div className="h-[65%]"></div>
        <hr className="text-gray-100"></hr>
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
      </aside>
    );
  }
}

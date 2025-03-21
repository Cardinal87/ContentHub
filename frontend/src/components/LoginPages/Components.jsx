import { useState, useRef, useEffect } from "react";
import { Navigate, replace, useNavigate } from "react-router-dom";

export function RepeatPasswordInput({
  id,
  value,
  onChange,
  onErrorChanged,
  password,
}) {
  const [localError, setLocalError] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    validate();
  }, [value, password]);
  function validate() {
    if (value !== password) {
      onErrorChanged(true);
      setLocalError("passwords do not match");
    } else {
      onErrorChanged(false);
      setLocalError("");
    }
  }
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-blue-600 text-left">
        Reenter password
      </label>
      <input
        id={id}
        type="password"
        placeholder="password"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className="border-2 text-gray-900 border-gray-200 focus:ring-1 focus:outline-none
        focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 transition-colors duration-300
        bg-gray-50 placeholder-gray-500 rounded-lg px-0.5 py-0.5"
      />
      <label htmlFor={id} className="text-red-500 text-right mr-2 h-6">
        {localError}
      </label>
    </div>
  );
}

export function DataInput({
  id,
  placeholder,
  type,
  label,
  value,
  onErrorChanged,
  onChange,
  serverError,
}) {
  const [localError, setLocalError] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    validate(value);
  }, [value]);

  function validate(value) {
    if (value.trim() == "") {
      setLocalError("field must not be empty");
      onErrorChanged(true);
    } else {
      setLocalError("");
      onErrorChanged(false);
    }
  }

  const error = serverError || localError;

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-blue-600 text-0.8xl text-left">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className="border-2 text-gray-900 border-gray-200 focus:ring-1 focus:outline-none
        focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 transition-colors duration-300
        bg-gray-50 placeholder-gray-500 rounded-lg px-0.5 py-0.5"
      />
      <label htmlFor={id} className="text-red-500 text-right mr-2 h-6">
        {error}
      </label>
    </div>
  );
}

export function Header() {
  return (
    <h1 className="text-4xl text-blue-600 font-bold mb-15">Content Hub</h1>
  );
}

export function ConfirmButton({ text, hasError, onClick }) {
  return (
    <div className="mt-5 flex flex-col items-center">
      <button
        id="confirm"
        disabled={hasError}
        className="text-gray-100 bg-blue-600 shadow-lg transition-colors 
        duration-300 border rounded-xl border-transparent px-20 py-1.5
        hover:bg-blue-700 disabled:bg-blue-900"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}

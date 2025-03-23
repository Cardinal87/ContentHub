import { useState, useRef, useEffect } from "react";
import { Link, Navigate, replace, useNavigate } from "react-router-dom";
import {
  RepeatPasswordInput,
  DataInput,
  ConfirmButton,
  Header,
} from "./Components";

export function LoginPage() {
  const [serverError, setServerError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({ login: true, password: true });

  function setPassword(password) {
    setCredentials((prev) => ({ password: password, username: prev.username }));
  }

  function setUsername(username) {
    setCredentials((prev) => ({ password: prev.password, username: username }));
  }

  const navigate = useNavigate();
  async function login() {
    try {
      const resp = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (resp.ok) {
        navigate("/");
      } else if (resp.status == 400) {
        setServerError("invalid login or password");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container h-max flex flex-col justify-center mb-[20%]">
      <Header />
      <DataInput
        id={"login"}
        label={"Enter login"}
        type={"text"}
        placeholder={"login"}
        onChange={(value) => {
          setUsername(value);
        }}
        value={credentials.username}
        onErrorChanged={(status) => {
          setErrors((prev) => ({ login: status, password: prev.password }));
        }}
      />
      <DataInput
        id={"password"}
        label={"Enter password"}
        type={"password"}
        placeholder={"password"}
        onChange={(value) => {
          setPassword(value);
          if (serverError != "") setServerError("");
        }}
        serverError={serverError}
        value={credentials.password}
        onErrorChanged={(status) => {
          setErrors((prev) => ({ login: prev.login, password: status }));
        }}
      />
      <ConfirmButton
        text={"Login"}
        hasError={Object.values(errors).some((er) => er)}
        onClick={login}
      />
      <Link
        to={"/signup"}
        className="text-blue-400 hover:text-blue-200 hover:font-bold"
      >
        create account
      </Link>
    </div>
  );
}

export function SignUpPage() {
  const [serverError, setServerError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [errors, setErrors] = useState({
    login: true,
    password: true,
    repeatedPassword: true,
  });

  function setPassword(password) {
    setCredentials((prev) => ({ password: password, username: prev.username }));
  }

  function setUsername(username) {
    setCredentials((prev) => ({ password: prev.password, username: username }));
  }

  async function signUp() {
    try {
      const resp = await fetch("http://localhost:8000/api/add/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (resp.ok) {
        navigate("/", { replace: true });
      } else if (resp.status == 400) {
        setServerError("username is already taken");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const navigate = useNavigate();
  return (
    <div className="container h-max flex flex-col justify-center mb-[20%]">
      <Header />
      <DataInput
        id={"login"}
        label={"Enter login"}
        type={"text"}
        placeholder={"login"}
        onChange={(value) => {
          setUsername(value);
          if (serverError != "") setServerError("");
        }}
        serverError={serverError}
        value={credentials.username}
        onErrorChanged={(status) => {
          setErrors((prev) => ({
            login: status,
            password: prev.password,
            repeatedPassword: prev.repeatedPassword,
          }));
        }}
      />
      <DataInput
        id={"password"}
        label={"Enter password"}
        type={"password"}
        placeholder={"password"}
        onChange={(value) => {
          setPassword(value);
        }}
        value={credentials.password}
        onErrorChanged={(status) => {
          setErrors((prev) => ({
            login: prev.login,
            password: status,
            repeatedPassword: prev.repeatedPassword,
          }));
        }}
      />
      <RepeatPasswordInput
        password={credentials.password}
        id={"reenter"}
        value={repeatedPassword}
        onChange={(value) => {
          setRepeatedPassword(value);
        }}
        onErrorChanged={(status) => {
          setErrors((prev) => ({
            login: prev.login,
            password: prev.password,
            repeatedPassword: status,
          }));
        }}
      />
      <ConfirmButton
        text={"Sign up"}
        hasError={Object.values(errors).some((er) => er)}
        onClick={signUp}
      />
    </div>
  );
}

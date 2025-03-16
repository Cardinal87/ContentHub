function DataInput({ type, placeholder, text, id }) {
  return (
    <div>
      <label htmlFor={id}>{text}</label>
      <input id={id} type={type} placeholder={placeholder} />
      <label htmlFor={id} id="error"></label>
    </div>
  );
}

function Header() {
  return <h1>Content Hub</h1>;
}

function ConfirmButton({ text }) {
  return (
    <div>
      <button id="confirm">{text}</button>
      <label htmlFor="confirm" id="error"></label>
    </div>
  );
}

export function LoginPage() {
  return (
    <div>
      <Header />
      <DataInput
        type={"text"}
        placeholder={"enter login"}
        text={"Enter login"}
        id={"login"}
      />
      <DataInput
        type={"password"}
        placeholder={"enter password"}
        id={"password"}
        text={"Enter password"}
      />
      <ConfirmButton text={"Login"} />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div>
      <Header />
      <DataInput
        type={"text"}
        placeholder={"enter login"}
        text={"Enter login"}
        id={"login"}
      />
      <DataInput
        type={"password"}
        placeholder={"enter password"}
        text={"Enter password"}
        id={"password"}
      />
      <DataInput
        type={"password"}
        placeholder={"reenter password"}
        text={"Reenter password"}
        id={"r_password"}
      />

      <ConfirmButton text={"Sign up"} />
    </div>
  );
}

function DataInput({ type, placeholder, text, id }) {
  return (
    <div className="flex flex-col mb-3">
      <label htmlFor={id} className="text-blue-600 text-0.8xl text-left">
        {text}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="border-2 text-gray-900 border-gray-200 focus:ring-1 focus:outline-none
        focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 transition-colors duration-300
        bg-gray-50 placeholder-gray-500 rounded-lg px-0.5 py-0.5"
      />
      <label htmlFor={id} id="error" className="text-red-500"></label>
    </div>
  );
}

function Header() {
  return (
    <h1 className="text-4xl text-blue-600 font-bold mb-15">Content Hub</h1>
  );
}

function ConfirmButton({ text }) {
  return (
    <div className="mt-5">
      <button
        id="confirm"
        className=" text-gray-100 text-0.5xl bg-blue-600 shadow-lg transition-colors 
        duration-300 border rounded-xl border-transparent px-3 py-1.5
        hover:bg-blue-700 hover:shadow-xl"
      >
        {text}
      </button>
      <label htmlFor="confirm" id="error"></label>
    </div>
  );
}

export function LoginPage() {
  return (
    <div className="container h-max flex flex-col justify-center mb-60">
      <Header />
      <DataInput
        type={"text"}
        placeholder={"login"}
        text={"Enter login"}
        id={"login"}
      />
      <DataInput
        type={"password"}
        placeholder={"password"}
        id={"password"}
        text={"Enter password"}
      />
      <ConfirmButton text={"Login"} />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="container h-max flex flex-col justify-center mb-60">
      <Header />
      <DataInput
        margin={"mt-10"}
        type={"text"}
        placeholder={"enter login"}
        text={"Enter login"}
        id={"login"}
      />
      <DataInput
        margin={"mt-4"}
        type={"password"}
        placeholder={"password"}
        text={"Enter password"}
        id={"password"}
      />
      <DataInput
        type={"password"}
        placeholder={"password"}
        text={"Reenter password"}
        id={"r_password"}
      />

      <ConfirmButton text={"Sign up"} />
    </div>
  );
}

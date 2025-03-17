function NoteText() {
  return (
    <div className="container">
      <p
        className="w-4xl h-[900px] break-words text-gray-100 overflow-x-hidden overflow-y-auto text-left
                    bg-gray-700 border border-gray-500 rounded-xl shadow-xl p-3"
      >
        Text
      </p>
    </div>
  );
}

function NoteEditing() {
  return (
    <div className="container flex flex-col">
      <textarea
        className=" h-[900px] w-4xl text-gray-100 resize-none bg-gray-700 border border-gray-500
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="deletebtn"
      className="fill-blue-600 hover:fill-blue-500 transition-colors duration-300 mr-1 ml-3"
      width="25"
      height="25"
      viewBox="0 0 16 16"
    >
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
    </svg>
  );
}

function ChangeButton() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="changebtn"
      className="fill-blue-600 hover:fill-blue-500 transition-colors duration-300"
      width="25"
      height="25"
      viewBox="0 0 16 16"
    >
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
    </svg>
  );
}

function SettingsButton() {
  return (
    <button
      className="flex text-gray-100 mx-3 text-xl items-center hover:bg-gray-700
    py-2 rounded-lg px-1 transition-colors duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={27}
        height={27}
        className="fill-blue-600 mr-3"
      >
        <path
          d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3
          39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1
          31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2
            17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6
            .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4
              191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1
              9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7
                8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
        />
      </svg>
      Settings
    </button>
  );
}

function ProfileButton() {
  return (
    <button
      className="flex text-gray-100 mx-3 text-xl items-center hover:bg-gray-700 
    py-2 px-1 rounded-lg transition-colors duration-300"
    >
      <svg
        width="30"
        height="30"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-3"
      >
        {" "}
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
          className="stroke-blue-600"
          stroke-linecap="round"
          stroke-linejoin="round"
        />{" "}
        <path
          d="M4.271 18.3457C4.271 18.3457 6.50002 15.5 12 15.5C17.5 15.5 19.7291 18.3457 19.7291 18.3457"
          className="stroke-blue-600"
          stroke-linecap="round"
          stroke-linejoin="round"
        />{" "}
        <path
          d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
          className="stroke-blue-600"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Profile
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

function SideBar({ children }) {
  return (
    <aside
      className="left-0 top-0 border-r-2 border-gray-500 bg-gray-900 fixed w-[250px] h-screen z-50
    transition-transform duration-300 flex flex-col"
    >
      <div className="h-7/8">
        <ul></ul>
      </div>
      <hr className="text-gray-100"></hr>
      <div className="flex flex-col justify-end mt-auto mb-3">
        <ProfileButton></ProfileButton>
        <SettingsButton></SettingsButton>
      </div>
    </aside>
  );
}

export function MainPage() {
  return (
    <div className="container flex flex-col">
      <SideBar></SideBar>
      <Name name={"note"}></Name>
      <div className="flex justify-end mb-3 mt-2">
        <ChangeButton></ChangeButton>
        <DeleteButton></DeleteButton>
      </div>
      <NoteEditing></NoteEditing>
    </div>
  );
}

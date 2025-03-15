function DataInput({type, placeholder, text}){
    return(
        <div>
            <label for="input" >{text}</label>
            <input id="input" type={type} placeholder={placeholder}/>
            <label for="input" id="error"></label>
        </div>
    )
}

function Header(){
    return(
        <h1>
            Content Hub
        </h1>
    )
}

function ConfirmButton({text}){
    return(
        <div>
            <button id="confirm">{text}</button>
            <label for="confirm" id="error"></label>
        </div>
    )
}

export function LoginPage(){
    return(
        <div>
            <Header/>
            <DataInput type={"text"} placeholder={"enter login"} text={"Enter login"}/>
            <DataInput type={"password"} placeholder={"enter password"} text={"Enter password"}/>
            <ConfirmButton text={"Login"}/>
        </div>
    );
}

export function SignUpPage(){
    return(
        <div>
            <Header/>
            <DataInput type={"text"} placeholder={"enter login"} text={"Enter login"}/>
            <DataInput type={"password"} placeholder={"enter password"} text={"Enter password"}/>
            <DataInput type={"password"} placeholder={"reenter password"} text={"Reenter password"}/>
            
            <ConfirmButton text={"Sign up"}/>
        </div>
    );
}

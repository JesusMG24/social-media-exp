import Login from "./Login"
import Logout from "./Logout";

export default function Header() {

    return (
        <header className='font-bold flex flex-col font-normal gap-5 pb-5 items-center'>
            <h1 className="font-bold bg-teal-900 w-screen flex justify-center py-2"><a href="/">HOME</a></h1>
            <Logout />
            <Login />
        </header>
    )
}
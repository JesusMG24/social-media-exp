import Login from "./Login"
import Logout from "./Logout";

export default function Header() {

    return (
        <header className='font-bold flex flex-col font-normal gap-5 pb-5 items-center 2xl:gap-0 2xl:pb-0'>
            <h1 className="font-bold bg-sky-600 w-screen flex justify-center py-2"><a href="/">HOME</a></h1>
            <Logout />
            <Login />
        </header>
    )
}
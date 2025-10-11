import { postLogout } from "../api/logout";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
    const { username, setUsername } = useAuth();

    if (!username) return null;

    const handleLogout = async (e) => {
        e.preventDefault();
        postLogout();
        setUsername("");
    };
    
    return (
        <div className="flex gap-[10vw] 2xl:gap-[2vw] 2xl:py-[2vh] 2xl:border-x 2xl:w-[40vw] 2xl:justify-center 2xl:border-gray-700">
            <h2>
                {username}
            </h2>
            <button className='bg-gray-500 rounded-full flex w-20 justify-center' onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}
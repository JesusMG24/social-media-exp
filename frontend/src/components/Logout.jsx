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
        <>
            <h2>
                {username}
            </h2>
            <button className='bg-gray-500 rounded-full flex w-20 justify-center' onClick={handleLogout}>
                Logout
            </button>
        </>
    )
}
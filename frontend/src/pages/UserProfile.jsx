import { useParams } from "react-router-dom";
import { fetchUserPosts } from "../api/posts";
import Header from "../components/Header";
import Posts from "../components/Posts";

export default function UserProfile() {
    const { userid } = useParams();
    
    return (
        <main className="w-screen flex flex-col justify-center">
            <Header />
            <Posts userid={userid}/>
        </main>
    )
}
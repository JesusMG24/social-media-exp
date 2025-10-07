import { useEffect, useState } from "react";
import { fetchPosts, postPost } from "../api/posts";

export default function Posts(props) {
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [showPost, setShowPost] = useState(false);
    const [showPostButton, setShowPostButton] = useState(true);
    const { username } = props;

    useEffect(() => {
        fetchPosts().then(setPosts);
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        const data = {
            title: postTitle.trim(),
            content: postContent.trim(),
        };
        try {
            await postPost(data);
            setPostTitle("");
            setPostContent("");
            setShowPost(false);
            fetchPosts().then(setPosts);
        } catch (error) {
            console.error("Failed to publish post:", error);
        }
    }
    
    return (
        <section className="w-screen">
            {showPost && (
                <form className="flex flex-col fixed w-full bg-black top-0 h-screen" onSubmit={handlePost}>
                    <div className="flex gap-[50vw] justify-around mt-5">
                        <button type="button" onClick={() => {setShowPost(false); setShowPostButton(true);}} className="scale-x-150">X</button>
                        <button type="submit" className="bg-blue-500 rounded-full w-15 h-8">Post</button>
                    </div>
                    <h3 className="text-center mt-5">{username}</h3>
                    <div className="w-full flex flex-col items-center mt-5 text-xl gap-2">
                        <textarea value={postTitle} className="w-[80vw] max-h-[40vh] focus:outline-hidden" placeholder="Your post title..." onChange={(e) => {setPostTitle(e.target.value)}} rows={2}></textarea>
                        <textarea value={postContent} className="w-[80vw] max-h-[40vh] overflow-y-auto resize-none focus:outline-hidden" rows={10} placeholder="What are you thinking?" onChange={(e) => {setPostContent(e.target.value)}}></textarea>
                    </div>
                </form>
            )}
            <button onClick={() => {setShowPost(true); setShowPostButton(false);}} style={{ display: showPostButton ? "flex" : "none" }}className="fixed z-50 rounded-full bg-blue-500 flex aspect-square items-center justify-center w-15 bottom-[15vw] right-[5vw]">
                <p className="text-3xl">+</p>
            </button>
            <ul className="w-screen flex flex-col" style={{ display: showPostButton ? "flex" : "none"}}>
                {posts.map((post, index) => (
                    <li key={index} className="border-t border-gray-700 pt-15 pb-5 pl-[15vw] pr-[5vw] flex flex-col gap-2 relative">
                        <div className="flex absolute left-4 top-5 gap-2 font-bold">
                            <img className="h-10 aspect-square rounded-full" src={post.avatar_url}></img>
                            <p>{post.author}</p>
                        </div>
                        <p className="absolute top-5 right-4 text-gray-500">{post.created_at}</p>
                        <h3><strong>{post.title}</strong></h3>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}
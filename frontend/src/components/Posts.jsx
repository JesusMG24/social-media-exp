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
        <section>
            {showPost && (
                <form className="flex flex-col fixed w-screen bg-black top-0 h-screen" onSubmit={handlePost}>
                    <div className="flex gap-[50vw] justify-around mt-5">
                        <button type="button" onClick={() => {setShowPost(false); setShowPostButton(true);}} className="scale-x-150">X</button>
                        <button type="submit" className="bg-blue-500 rounded-full w-15 h-8">Post</button>
                    </div>
                    <h3 className="text-center mt-5">{username}</h3>
                    <div className="w-full flex flex-col items-center mt-5 text-xl gap-2">
                        <textarea value={postTitle} className="w-[80vw] max-h-[40vh]" placeholder="Your post title..." onChange={(e) => {setPostTitle(e.target.value)}} rows={2}></textarea>
                        <textarea value={postContent} className="w-[80vw] max-h-[40vh] overflow-y-auto resize-none" rows={10} placeholder="What are you thinking?" onChange={(e) => {setPostContent(e.target.value)}}></textarea>
                    </div>
                </form>
            )}
            <button onClick={() => {setShowPost(true); setShowPostButton(false);}} style={{ display: showPostButton ? "flex" : "none" }}className="fixed rounded-full bg-blue-500 flex aspect-square items-center justify-center w-15 bottom-[15vw] right-[5vw]">
                <p className="text-3xl">+</p>
            </button>
            <ul className="w-screen flex flex-col">
                {posts.map((post, index) => (
                    <li key={index} className="border-t border-gray-700 py-5 px-[15vw] flex flex-col gap-2">
                        <h3><strong>{post.title}</strong></h3>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}
import { useEffect, useState, useRef } from "react";
import { fetchPosts, postPost, editPost, deletePost } from "../api/posts";

export default function Posts(props) {
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [showPost, setShowPost] = useState(false);
    const [showPostButton, setShowPostButton] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const lastPostRef = useRef(null);
    const { username } = props;

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const batch = await fetchPosts({ offset, limit });
            setPosts(prev => {
                const seen = new Set(prev.map(p => p.id));
                const add = batch.filter(p => !seen.has(p.id));
                return [...prev, ...add];
            });
            setOffset(prev => prev + batch.length);
            if (batch.length < limit) setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPosts([]);
        setOffset(0);
        setHasMore(true);
        loadMore();
    }, []);

    useEffect(() => {
        if (!hasMore) return;
        const lastPost = lastPostRef.current;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) loadMore();
            },
            { root: null, rootMargin: "100px", threshold: 0 }
        );
        if (lastPost) observer.observe(lastPost);
        return () => { if (lastPost) observer.unobserve(lastPost); };
    }, [posts.length, hasMore]); 

    const handlePost = async (e) => {
        e.preventDefault();
        const data = { title: postTitle.trim(), content: postContent.trim() };
        if (!data.title || !data.content) return;
        try {
            if (editingId) {
                await editPost({ id: editingId, ...data });
            } else {
                await postPost(data);
            }
            setPostTitle("");
            setPostContent("");
            setEditingId(null);
            setShowPost(false);
            setShowPostButton(true);
            const fresh = await fetchPosts({ offset: 0, limit });
            setPosts(fresh);
            setOffset(fresh.length);
            setHasMore(fresh.length === limit);
        } catch (error) {
            console.error("Failed to submit post:", error);
            setShowPost(false);
            setShowPostButton(true);
            setEditingId(null);
        }
    };
    
    function formatDate(isoString) {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    return (
        <section className="w-screen">
            {showPost && (
                <form className="flex flex-col fixed w-full bg-black top-0 h-screen" onSubmit={handlePost}>
                    <div className="flex gap-[50vw] justify-around mt-5">
                        <button type="button" className="scale-x-150" onClick={() => { setShowPost(false); setShowPostButton(true); setEditingId(null); }}>
                          X
                        </button>
                        <button type="submit" className="bg-blue-500 rounded-full w-15 h-8">
                          {editingId ? "Save" : "Post"}
                        </button>
                    </div>
                    <h3 className="text-center mt-5">{username}</h3>
                    <div className="w-full flex flex-col items-center mt-5 text-xl gap-2">
                        <textarea value={postTitle} className="w-[80vw] max-h-[40vh] focus:outline-hidden" placeholder="Your post title..." onChange={(e) => {setPostTitle(e.target.value)}} rows={2}></textarea>
                        <textarea value={postContent} className="w-[80vw] max-h-[40vh] overflow-y-auto resize-none focus:outline-hidden" rows={10} placeholder="What are you thinking?" onChange={(e) => {setPostContent(e.target.value)}}></textarea>
                    </div>
                </form>
            )}
            <button onClick={() => {setShowPost(true); setShowPostButton(false);}} style={{ display: showPostButton && username ? "flex" : "none" }} className="fixed z-50 rounded-full bg-blue-500 flex aspect-square items-center justify-center w-15 bottom-[15vw] right-[5vw]">
                <p className="text-3xl">+</p>
            </button>
            <ul className="w-screen flex flex-col" style={{ display: showPost ? "none" : "flex" }}>
                {posts.map((post, index) => {
                    const isLast = index === posts.length - 1;
                    return (
                        <li key={index} ref={isLast ? lastPostRef : null} className="border-t border-gray-700 pt-15 pb-10 pl-[15vw] pr-[5vw] flex flex-col gap-2 relative">
                            <div className="flex absolute left-4 top-5 gap-2 font-bold">
                                <img className="h-10 aspect-square rounded-full" src={post.avatar_url} />
                                <p>{post.author}</p>
                            </div>
                            {username && post.author === username && (
                            <div className="absolute top-5 right-3 flex gap-5">
                                <button className="underline" onClick={() => {setEditingId(post.id); setPostTitle(post.title); setPostContent(post.content); setShowPost(true); setShowPostButton(false);}}>Edit</button>
                                <button className="text-red-500 font-bold scale-x-150" onClick={() => handleDelete(post.id)}>X</button>
                            </div>
                            )}
                            <p className="absolute bottom-3 right-3 text-gray-500 text-xs">Posted: {formatDate(post.created_at)}</p>
                            <p className="absolute bottom-3 left-3 text-gray-500 text-sm" style={{ display: post.updated_at === post.created_at ? "none" : "flex" }} title={formatDate(post.updated_at)}>Edited</p>
                            <h3><strong>{post.title}</strong></h3>
                            <p>{post.content}</p>
                        </li>
                    );
                })}
                {loading && <li className="flex w-full justify-center"><div className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-gray-400 rounded-full"></div></li>}
                {!hasMore && posts.length > 0 && <li className="py-4 text-center text-gray-500 border-t border-gray-700">No more posts</li>}
            </ul>
        </section>
    )
}
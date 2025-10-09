import { useEffect, useState, useRef } from "react";
import { fetchPosts, deletePost, fetchUserPosts } from "../api/posts";
import { usePostForm } from "../hooks/usePostForm";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import PostForm from "./PostForm";

export default function Posts(props) {
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const lastPostRef = useRef(null);
    const { username } = useAuth();
    const { userid } = props;

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            if (userid) {
                const batch = await fetchUserPosts({ offset, limit, userid });
                setPosts(prev => {
                    const seen = new Set(prev.map(p => p.id));
                    const add = batch.filter(p => !seen.has(p.id));
                    return [...prev, ...add];
                });
                setOffset(prev => prev + batch.length);
                if (batch.length < limit) setHasMore(false);
            } else {
                const batch = await fetchPosts({ offset, limit });
                setPosts(prev => {
                    const seen = new Set(prev.map(p => p.id));
                    const add = batch.filter(p => !seen.has(p.id));
                    return [...prev, ...add];
                });
                setOffset(prev => prev + batch.length);
                if (batch.length < limit) setHasMore(false);
            }
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

    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const postForm = usePostForm({
        setPosts,
        setOffset,
        setHasMore,
        limit,
        username
    });

    const { showPost, setShowPost, setShowPostButton, setEditingId, setPostTitle, setPostContent } = postForm;

    return (
        <section className="w-screen">
            <ul className="w-screen flex flex-col">
                {posts.map((post, index) => {
                    const isLast = index === posts.length - 1;
                    return (
                        <li key={post.id} ref={isLast ? lastPostRef : null} className="border-t border-gray-700 pt-15 pb-10 pl-[15vw] pr-[5vw] flex flex-col gap-2 relative">
                            <div className="flex absolute left-4 top-5 gap-2 font-bold">
                                <img className="h-10 aspect-square rounded-full" src={post.avatar_url} />
                                <p><a href={`/profile/${post.author_id}`}>{post.author}</a></p>
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
            <PostForm {...postForm} />
        </section>
    )
}
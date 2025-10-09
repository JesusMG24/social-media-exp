import { useState } from "react";
import { postPost, editPost, fetchPosts } from "../api/posts";

export function usePostForm({ setPosts, setOffset, setHasMore, limit, username }) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [showPostButton, setShowPostButton] = useState(true);
  const [editingId, setEditingId] = useState(null);

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
      setShowPost(false);
      setShowPostButton(true);
      setEditingId(null);
    }
  };

  return {
    postTitle, setPostTitle,
    postContent, setPostContent,
    showPost, setShowPost,
    showPostButton, setShowPostButton,
    editingId, setEditingId,
    handlePost,
    username
  };
}
import api from "./api";

export const fetchPosts = async () => {
    try {
        const response = await api.get(`/posts`);
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
};

export const postPost = async (data) => {
    try {
        const response = await api.post(`/posts`, data);
    } catch (error) {
        console.error("Failed to publish post:", error);
    }
};
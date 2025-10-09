import api from "./api";

export const fetchPosts = async ({ offset = 0, limit = 10 } = {}) => {
    try {
        const response = await api.get(`/posts`, { params: { offset, limit } });
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
};

export const postPost = async (data) => {
    try {
        const response = await api.post(`/posts`, data);
        return response.data;
    } catch (error) {
        console.error("Failed to publish post:", error);
        throw error;
    }
};

export const editPost = async (data) => {
    try {
        const response = await api.put('/posts', data);
        return response.data;
    } catch (error) {
        console.error("Failed to edit post:", error);
        throw error;
    }
};

export const deletePost = async (id) => {
    await api.delete(`/posts/${id}`);  
};

export const fetchUserPosts = async ({ offset = 0, limit = 10, userid } = {}) => {
    try {
        const response = await api.get(`/users/${userid}/posts`, { params: { offset, limit } });
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
};
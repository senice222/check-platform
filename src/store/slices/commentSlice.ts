import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/axios';
import axios from 'axios';

interface Comment {
    id: string;
    text: string;
    author: string;
    createdAt: string;
    file?: {
        originalName: string;
        path: string;
        mimetype: string;
    };
}

interface CommentState {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    backupComments: Comment[];
}

export const fetchComments = createAsyncThunk(
    'comments/fetch',
    async (applicationId: string, { rejectWithValue }) => {
        try {
            const response = await adminApi.get(`/comments/application/${applicationId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении комментариев');
        }
    }
);

export const addComment = createAsyncThunk(
    'comments/add',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await adminApi.post('/comments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при добавлении комментария');
        }
    }
);

export const deleteComment = createAsyncThunk(
    'comments/delete',
    async (commentId: string, { rejectWithValue }) => {
        try {
            await adminApi.delete(`/comments/${commentId}`);
            return commentId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при удалении комментария');
        }
    }
);

export const clearComments = createAsyncThunk(
    'comments/clear',
    async (applicationId: string, { rejectWithValue }) => {
        try {
            await adminApi.delete(`/comments/application/${applicationId}/clear`);
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при очистке комментариев');
        }
    }
);

const initialState: CommentState = {
    comments: [],
    isLoading: false,
    error: null,
    backupComments: []
};

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearCommentsLocally: (state) => {
            state.backupComments = state.comments;
            state.comments = [];
        },
        restoreComments: (state) => {
            state.comments = state.backupComments;
            state.backupComments = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(comment => comment.id !== action.payload);
            })
            .addCase(clearComments.fulfilled, (state) => {
                state.backupComments = [];
            })
            .addCase(clearComments.rejected, (state) => {
                state.comments = state.backupComments;
                state.backupComments = [];
            });
    }
});

export const { clearCommentsLocally, restoreComments } = commentSlice.actions;
export const commentActions = commentSlice.actions;
export default commentSlice.reducer; 
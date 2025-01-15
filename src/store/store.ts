import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import clientReducer from './slices/clientSlice';
import sellerReducer from './slices/sellerSlice';
import applicationReducer from './slices/applicationSlice';
import selectorsReducer from './slices/selectorsSlice';
import checkReducer from './slices/checkSlice';
import companyReducer from './slices/companySlice';
import commentReducer from './slices/commentSlice';
import historyReducer from './slices/historySlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        client: clientReducer,
        seller: sellerReducer,
        application: applicationReducer,
        selectors: selectorsReducer,
        check: checkReducer,
        company: companyReducer,
        comment: commentReducer,
        history: historyReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
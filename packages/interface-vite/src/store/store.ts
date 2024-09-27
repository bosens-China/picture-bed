import { configureStore } from '@reduxjs/toolkit';
import staging from './features/staging/slice';
import { getStore, setStore } from './utils';

export const store = configureStore({
  reducer: {
    staging,
  },
  preloadedState: getStore(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  setStore(store.getState());
});

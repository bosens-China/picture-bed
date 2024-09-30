import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash-es';

export type MenuItem = {
  key: 'main' | string;
  label: React.ReactNode;
  uid: string;
};

export interface State {
  /**
   * 用户的列表
   *
   * @type {Array<MenuItem>}
   * @memberof State
   */
  users: Array<MenuItem>;
  /**
   * 当前选中项
   *
   * @type {string}
   * @memberof State
   */
  selected?: MenuItem['key'];
}

const initialState: State = {
  users: [],
};

export const staging = createSlice({
  name: 'staging',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<MenuItem>) => {
      state.users = _.uniqBy([...state.users, action.payload], 'key');
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((item) => item.key !== action.payload);
    },
    clearUser: (state) => {
      state.users = [];
    },
    setSelected: (state, action: PayloadAction<State['selected']>) => {
      state.selected = action.payload;
    },

    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { addUser, removeUser, clearUser, setSelected } = staging.actions;

export default staging.reducer;

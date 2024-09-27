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
   * 工作台的列表
   *
   * @type {Array<MenuItem>}
   * @memberof State
   */
  staging: Array<MenuItem>;
  /**
   * 当前选中项
   *
   * @type {string}
   * @memberof State
   */
  selected?: MenuItem['key'];
}

const initialState: State = {
  staging: [],
};

export const staging = createSlice({
  name: 'staging',
  initialState,
  reducers: {
    addStaging: (state, action: PayloadAction<MenuItem>) => {
      state.staging = _.uniqBy([...state.staging, action.payload], 'key');
    },
    removeStaging: (state, action: PayloadAction<string>) => {
      state.staging = state.staging.filter(
        (item) => item.key !== action.payload,
      );
    },
    clearStaging: (state) => {
      state.staging = [];
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
export const { addStaging, removeStaging, clearStaging, setSelected } =
  staging.actions;

export default staging.reducer;

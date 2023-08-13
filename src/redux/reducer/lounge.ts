import { createSlice } from '@reduxjs/toolkit'

interface LoungeState {
  scene: {
    loaded: boolean;
  }
}

const initialState: LoungeState = {
  scene: {
    loaded: false
  }
}

const loungeSlice = createSlice({
  name: 'lounge',
  initialState,
  reducers: {
    initLoungeStateAction: (state) => {
      Object.assign(state, initialState)
    },
    setSceneLoadedAction: (state, { payload }) => {
      state.scene.loaded = payload
    }
  }
})

export const {
  initLoungeStateAction,
  setSceneLoadedAction
} = loungeSlice.actions

export default loungeSlice.reducer
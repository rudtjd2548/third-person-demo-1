import { createSlice } from '@reduxjs/toolkit'

interface MainState {
  scene: {
    loaded: boolean
  }
  scroll: {
    current: number
    percent: number
    isScrolling: boolean
  }
}

const initialState: MainState = {
  scene: {
    loaded: false,
  },
  scroll: {
    current: 0,
    percent: 0,
    isScrolling: false
  },
}

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    initMainStateAction: (state) => {
      Object.assign(state, initialState)
    },
    setSceneLoadedAction: (state, { payload }) => {
      state.scene.loaded = payload
    },
    setScrollCurrentAction: (state, { payload }) => {
      state.scroll.current = payload
    },
    setIsScrollingAction: (state, { payload }) => {
      state.scroll.isScrolling = payload
    }
  },
})

export const {
  initMainStateAction,
  setSceneLoadedAction,
  setScrollCurrentAction,
  setIsScrollingAction
} = mainSlice.actions

export default mainSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { cardData } from '@src/utils/constants.ts'

interface LoungeState {
  scene: {
    loaded: boolean
  }
  data: any
  scroll: {
    current: number
    percent: number
  }
}

const initialState: LoungeState = {
  scene: {
    loaded: false,
  },
  data: cardData,
  scroll: {
    current: 0,
    percent: 0,
  },
}

const questSlice = createSlice({
  name: 'quest',
  initialState,
  reducers: {
    initQuestStateAction: (state) => {
      Object.assign(state, initialState)
    },
    setSceneLoadedAction: (state, { payload }) => {
      state.scene.loaded = payload
    },
    setScrollAction: (state, { payload }) => {
      state.scroll.percent = payload
      state.scroll.current = Math.floor((state.data.length - 1) * payload)
    },
  },
})

export const { initQuestStateAction, setSceneLoadedAction, setScrollAction } = questSlice.actions

export default questSlice.reducer

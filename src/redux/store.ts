import { combineReducers, configureStore } from '@reduxjs/toolkit'
import loungeReducer from '@src/redux/reducer/lounge.ts'
import questReducer from '@src/redux/reducer/quest.ts'
import mainReducer from '@src/redux/reducer/main.ts'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const rootReducer = combineReducers({
  lounge: loungeReducer,
  quest: questReducer,
  main: mainReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

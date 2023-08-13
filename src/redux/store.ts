import { combineReducers, configureStore } from '@reduxjs/toolkit'
import loungeReducer from '@src/redux/reducer/lounge.ts'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const rootReducer = combineReducers({
  lounge: loungeReducer
})

export const store =  configureStore({
  reducer: rootReducer,
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
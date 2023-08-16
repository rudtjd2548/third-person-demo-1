import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const LoungePage = React.lazy(() => import('@src/pages/lounge.tsx'))

export default function App() {
  return (
    <>
      <Routes>
        <Route path={'lounge'} element={<LoungePage />} />
        <Route path={'*'} element={<Navigate replace to={'/lounge'} />} />
      </Routes>
    </>
  )
}

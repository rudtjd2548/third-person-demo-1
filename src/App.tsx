import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const LoungePage = React.lazy(() => import('@src/pages/lounge.tsx'))
const QuestPage = React.lazy(() => import('@src/pages/quest.tsx'))
const Quest2Page = React.lazy(() => import('@src/pages/quest2.tsx'))

export default function App() {
  return (
    <>
      <Routes>
        <Route path={'lounge'} element={<LoungePage />} />
        <Route path={'quest'} element={<QuestPage />} />
        <Route path={'quest2'} element={<Quest2Page />} />
        <Route path={'*'} element={<Navigate replace to={'/lounge'} />} />
      </Routes>
    </>
  )
}

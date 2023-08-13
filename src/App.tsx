import { Navigate, Route, Routes } from 'react-router-dom'
import LoungePage from '@src/pages/lounge.tsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<LoungePage />} />
        <Route path={'*'} element={<Navigate replace to={'/'} />} />
      </Routes>
    </>
  )
}
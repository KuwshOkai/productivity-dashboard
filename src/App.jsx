import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Pomodoro from './pages/Pomodoro'
import Stats from './pages/Stats'
import Tasks from './pages/Tasks'

function App() {
  return (
    <Router>
      <div className='flex min-h-screen w-full'>
        <Sidebar />
        <main className='flex-1 bg-gray-100 overflow-y-auto'>
          <Routes>
            <Route path='/' element={<Navigate to='/tasks' />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/pomodoro' element={<Pomodoro />} />
            <Route path='/stats' element={<Stats />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-indigo-500 mb-4">NeuroUX Component Marketplace</h1>
        <p className="text-slate-400">Welcome to your NeuroUX Component Marketplace project structure setup.</p>
      </div>
    </Router>
  )
}

export default App

import React, { useState } from 'react'
import './App.css'

import ChatComponent from './components/chat'

function App() {
  return (
    <div>
      <h1 className="mb-4 text-left">🔮 RAGstack</h1>
      <p className="mb-4 text-left text-3xl">Chat with your private documents</p>
      <ChatComponent />
    </div>
  )
}

export default App

import React, { useState } from 'react'
import './App.css'

import ChatComponent from './components/chat'

function App() {
  return (
    <div>
      <div className="text-8xl">
        🔮
      </div>
      <h1 className="m-4">RagStack</h1>
      <p className="mb-4 text-3xl">Chat with your private documents</p>
      <ChatComponent />
    </div>
  )
}

export default App

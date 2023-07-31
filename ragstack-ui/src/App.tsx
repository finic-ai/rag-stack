import React, { useState, useEffect } from 'react'
import './App.css'
import useLocalStorage from "./useLocalStorage";
import supabase from "./lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { UserStateProvider } from "./context/UserStateContext";
import ChatComponent from './pages/chat'

function App() {
  const [session, setSession] = useLocalStorage("session", null);

  console.log(session)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </div>
    </div>
  )
  }
  else {
    return (
      <UserStateProvider>
        <ChatComponent />
      </UserStateProvider>   
    )
  }
}

export default App

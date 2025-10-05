import { useState, useEffect } from 'react'
import Posts from './components/Posts'
import Login from './components/Login'

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const item = localStorage.getItem("username");
    if (item) {
      try {
        const parsed = JSON.parse(item);
        if (parsed.expiry > Date.now()) {
          setUsername(parsed.value);
        }
      } catch {
        setUsername("");
      }
    }
  }, []);

  return (
    <main className='flex flex-col w-screen items-center'> 
      {!username && (
        <div>
          <Login setUsername={setUsername}/>
        </div>
      )}
      <header className='py-5 font-bold'>
        <h2>{username ? username : "Not logged in"}</h2>
      </header>
      <Posts username={username}/>
    </main>
  )
}

export default App

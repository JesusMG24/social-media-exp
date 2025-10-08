import { useState, useEffect } from 'react'
import Posts from './components/Posts'
import Login from './components/Login'
import { postLogout } from './api/logout';

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

  const handleLogout = async (e) => {
    e.preventDefault();
    postLogout();
    setUsername("");
  }

  return (
    <main className='flex flex-col w-screen items-center'>
      <header className='font-bold flex font-normal gap-5 py-5'>
        <h2>{username ? username : ""}</h2>
        <button className='bg-gray-500 rounded-full flex w-20 justify-center' onClick={handleLogout} style={{ display: username ? "flex" : "none"}}>Logout</button>
        <div style={{ display: !username ? "flex" : "none"}}>
          <Login setUsername={setUsername}/>
        </div>
      </header>
      <Posts username={username}/>
    </main>
  )
}

export default App

import { postLogin } from "../api/login";
import { useState } from "react";

export default function Login(props) {
  const { setUsername } = props;
  const [userForm, setUserForm] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const username = userForm.trim();
    if (!username) return;
    try {
      await postLogin({ username });
      setUsername(username);
      const now = new Date();
      const item = {
        value: username,
        expiry: now.getTime() + 86400000,
      };
      localStorage.setItem("username", JSON.stringify(item));
      setUserForm("");
    } catch (err) {
      console.error("Failed to Login:", err);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex">
      <input className="bg-gray-900 rounded-l-md focus:outline-none w-60" type="text" value={userForm} onChange={(e) => setUserForm(e.target.value)} placeholder="You can type any username!"/>
      <button type="submit" className="bg-gray-500 rounded-r-md flex w-15 justify-center">Login</button>
    </form>
  );
}
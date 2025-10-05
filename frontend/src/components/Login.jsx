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
    <form onSubmit={onSubmit}>
      <input type="text" value={userForm} onChange={(e) => setUserForm(e.target.value)} placeholder="Username"/>
      <button type="submit">Login</button>
    </form>
  );
}
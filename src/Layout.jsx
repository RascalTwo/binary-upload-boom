import { useEffect, useState } from "react";
import Link from "next/link";
import Messages from './components/Messages';
import { GlobalContext } from "./context";

export default function Layout({ children }) {
  const [user, setUser] = useState();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (user == undefined) fetch('/api/user')
      .then(res => res.json())
      .then(res => setUser(res.user));
  }, [user]);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMessages({});
      }
    }
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <>
      <header className="container">
        <div className="text-center">
          <h1 className=""><Link href={user ? '/profile/' + user.userName : '/'}>Binary Upload Boom</Link></h1>
          <span>The #100Devs Social Network</span>
        </div>
      </header>
			<Messages messages={messages} />
      <GlobalContext.Provider value={{ user, setUser, setMessages }}>
        {children}
      </GlobalContext.Provider>
    </>
  );
}

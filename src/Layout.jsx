import { useEffect, useState } from "react";
import Link from "next/link";
import Messages from './components/Messages';
import { GlobalContext } from "./context";
import { useSession } from "next-auth/react"

export default function Layout({ children }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [messages, setMessages] = useState({});

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
      <GlobalContext.Provider value={{ user, setMessages }}>
        {children}
      </GlobalContext.Provider>
    </>
  );
}

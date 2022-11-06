import { useContext, createContext } from "react";

export const GlobalContext = createContext({
	user: null,
	setUser: () => undefined,
	messages: {},
	setMessages: () => undefined,
});

export default function useGlobals(){
	return useContext(GlobalContext);
}
import { Message } from '@/lib/validators/message'
import { createContext, useState } from 'react'

export const MessagesContext = createContext<{
	messages: Message[]
	isMessageUpdating: boolean
	addMessage: (message: Message) => void
	removeMessage: (id: string) => void // optomistic update
	updateMessage: (id: string, updateFn: (prevTexT: string) => string) => void
	setIsMessageUpdating: (isUpdating: boolean) => void // for loading state
}>({
	messages: [],
	isMessageUpdating: false,
	addMessage: () => {},
	removeMessage: () => {},
	updateMessage: () => {},
	setIsMessageUpdating: () => {},
})

export function MessagesProvider({ children }: { children: React.ReactNode }) {
	/****************************************** 
   states to pass in the Context Provider
  ******************************************/
	const [messages, setMessages] = useState<Message[]>([
		{
			id: crypto.randomUUID(),
			text: 'Hello, how can I help you',
			isUserMessage: false,
		},
	])

	const [isMessageUpdating, setIsMessageUpdating] = useState(false)

	/****************************************** 
   functions to pass in the Context Provider
  ******************************************/
	const addMessage = (message: Message) => {
		setMessages((prev) => [...prev, message])
	}

	// when stream fails, we want to remove it from the UI
	const removeMessage = (id: string) => {
		setMessages((prev) => prev.filter((message) => message.id !== id))
	}

	const updateMessage = (
		id: string,
		updateFn: (prevText: string) => string
	) => {
		setMessages((prev) =>
			prev.map((message) =>
				message.id === id
					? { ...message, text: updateFn(message.text) }
					: message
			)
		)
	}

	return (
		<MessagesContext.Provider
			value={{
				messages,
				addMessage,
				removeMessage,
				updateMessage,
				isMessageUpdating,
				setIsMessageUpdating,
			}}
		>
			{children}
		</MessagesContext.Provider>
	)
}

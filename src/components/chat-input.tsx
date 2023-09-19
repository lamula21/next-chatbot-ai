'use client'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Message } from '@/lib/validators/message'
import { MessagesContext } from '@/context/messages'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

// GOAL:
// 1. send data to the server with React Query
// 2. get data as stream data
export const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
	const [input, setInput] = useState('')
	const textareaRef = useRef<null | HTMLTextAreaElement>(null)

	const {
		messages,
		addMessage,
		isMessageUpdating,
		removeMessage,
		setIsMessageUpdating,
		updateMessage,
	} = useContext(MessagesContext)

	const { mutate: sendMessage, isLoading } = useMutation({
		// fetch functions
		// lib/validots/Message: validatopn with zod
		mutationFn: async (message: Message) => {
			const response = await fetch('/api/message', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify({ messages }),
			})

			return response.body
		},

		onMutate(message) {
			addMessage(message)
		},

		//
		onSuccess: async (stream) => {
			if (!stream) throw new Error('Stream is not defined')

			const id = crypto.randomUUID()

			const responseMessage: Message = {
				id,
				isUserMessage: false,
				text: '',
			}

			addMessage(responseMessage)

			setIsMessageUpdating(true)

			const reader = stream.getReader()
			const decoder = new TextDecoder()
			let done = false

			while (!done) {
				const { value, done: doneReading } = await reader.read()
				done = doneReading
				const chunkValue = decoder.decode(value)

				updateMessage(id, (prev) => prev + chunkValue)

				// clean up
				setIsMessageUpdating(false)
				setInput('')

				setTimeout(() => {
					textareaRef.current?.focus()
				}, 10)
			}
		},
	})

	return (
		<div {...props} className={cn('border-t border-zinc-300', className)}>
			{/* flex-1: fills out the remaining space */}
			<div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
				<TextareaAutosize
					ref={textareaRef}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()

							const message = {
								id: crypto.randomUUID(),
								isUserMessage: true,
								text: input,
							}

							sendMessage(message)
						}
					}}
					rows={2}
					maxRows={3}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					autoFocus
					placeholder="Write a message...
        "
					className="peer block text-gray-900 bg-zinc-100 text-sm w-full py-1.5 pr-14 resize-none border-0 focus:ring-0 sm:leading-6 disabled:opacity-50"
				/>
			</div>
		</div>
	)
}

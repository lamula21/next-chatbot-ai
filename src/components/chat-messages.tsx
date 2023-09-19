'use client'
import React, { HTMLAttributes, useContext } from 'react'

import { cn } from '@/lib/utils'
import { MessagesContext } from '@/context/messages'
import { Markdownlite } from './markdownlite'

interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {}

export function ChatMessages({ className, ...props }: ChatMessageProps) {
	const { messages } = useContext(MessagesContext)
	const inverseMessages = [...messages].reverse()

	return (
		<div
			{...props}
			className={cn(
				'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch',
				className
			)}
		>
			<div className="flex-1 flex-grow" />
			{inverseMessages.map((message) => {
				return (
					<div className="chat-message" key={`${message.id}-${message.id}`}>
						<div
							className={cn(
								'flex items-end',
								message.isUserMessage && 'justify-end'
							)}
						>
							<div
								className={cn(
									'flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden',
									message.isUserMessage
										? 'order-1 items-end'
										: 'order-2 items-start'
								)}
							>
								<p
									className={cn(
										'px-4 py-2 rounded-lg',
										message.isUserMessage
											? 'bg-blue-600 text-white'
											: 'bg-gray-200 text-gray-900'
									)}
								>
									<Markdownlite text={message.text} />
								</p>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

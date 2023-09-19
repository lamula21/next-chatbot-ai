'use client'
import React, { FC, ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MessagesProvider } from '@/context/messages'

interface ProvidersProps {
	children: ReactNode
}

// provider for react-query
export const Providers: FC<ProvidersProps> = ({ children }) => {
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<MessagesProvider>{children}</MessagesProvider>
		</QueryClientProvider>
	)
}

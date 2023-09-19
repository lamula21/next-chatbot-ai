import './globals.css'
import { Inter } from 'next/font/google'

import { Chat } from '@/components/chat'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Bookbuddy',
	description: 'Your bookstroe for fantasy & mystery novels',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<Providers>
				<body className={inter.className}>
					<Chat />
					{children}
				</body>
			</Providers>
		</html>
	)
}

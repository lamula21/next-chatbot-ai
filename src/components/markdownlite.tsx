import Link from 'next/link'
import React from 'react'

export function Markdownlite({ text }: { text: string }) {
	const linkRegex = /\[(.+?)\]\((.+?)\)/g
	const parts = []

	let lastIndex = 0
	let match

	while ((match = linkRegex.exec(text)) !== null) {
		const [fullMatch, linkText, linkUrl] = match
		const matchStart = match.index
		const matchEnd = matchStart + fullMatch.length

		if (lastIndex !== matchStart) {
			parts.push(text.slice(lastIndex, matchStart))
		}

		parts.push(
			<Link
				key={linkUrl}
				href={linkUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="break-words underline underline-offset-2 text-blue-600"
			>
				{linkText}
			</Link>
		)

		lastIndex = matchEnd
	}

	if (lastIndex !== text.length) {
		parts.push(text.slice(lastIndex))
	}

	return (
		<>
			{parts.map((part, index) => (
				<React.Fragment key={index}>{part}</React.Fragment>
			))}
		</>
	)
}

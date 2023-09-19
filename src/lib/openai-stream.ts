import {
	ParsedEvent,
	ReconnectInterval,
	createParser,
} from 'eventsource-parser'

export type ChatGPTAgent = 'user' | 'system'

export interface ChatGPTMessage {
	role: ChatGPTAgent
	content: string
}

/* openai stream  type */
export interface OpenAIStreamPayload {
	model: string
	messages: ChatGPTMessage[]
	// temparature: float 0-1. Closer to 0 means the model will repeat itself more often. Closer to 1 means the model will be more random.
	temperature: number
	// top_p: float 0-1. Closer to 0 means the model will only pick the most likely words, closer to 1 means the model will pick a more diverse set of words.
	top_p: 1
	frequency_penalty: number
	presence_penalty: number
	// max_tokens is an integer. It is the maximum number of tokens to generate. The model will stop generating tokens once it hits this number.
	max_tokens: number
	stream: boolean
	n: number // number of responses to generate. The model will stop generating responses once it hits this number.
}

export async function OpenAIStream(payload: OpenAIStreamPayload) {
	const encoder = new TextEncoder() // for converting string to Uint8Array
	const decoder = new TextDecoder() // for converting Uint8Array to string

	let counter = 0

	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		headers: {
			'Content-Type': 'application/json', // important
			'Authorization': `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	})

	// readable stream
	const stream = new ReadableStream({
		async start(controller) {
			// npm i eventsource-parser: creates an instance of the parser and feeds it with chunks of data
			// convert stream from openapi to display it in the frontend
			function onParse(event: ParsedEvent | ReconnectInterval) {
				if (event.type === 'event') {
					const data = event.data
					if (data === '[DONE]') {
						controller.close()
						return
					}

					try {
						const json = JSON.parse(data)
						const text = json.choices[0].delta?.content || ''

						// if empty line, skip it
						if (counter < 2 && (text.match(/\n/) || []).length) {
							return
						}

						const queue = encoder.encode(text)
						controller.enqueue(queue)
						counter++
					} catch (error) {
						controller.error(error)
					}
				}
			}

			const parser = createParser(onParse)

			for await (const chunk of res.body as any) {
				parser.feed(decoder.decode(chunk))
			}
		},
	})

	return stream
}

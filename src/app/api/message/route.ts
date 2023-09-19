import { chatbotPrompt } from '@/helpers/constants/chatbot-prompt'
import { MessageArraySchema } from '@/lib/validators/message'
import {
	ChatGPTMessage,
	OpenAIStream,
	OpenAIStreamPayload,
} from '@/lib/openai-stream'

export async function POST(req: Request) {
	const { messages } = await req.json() // only works when Content-Type: application/json

	// validate client data with zod
	const parsedMessages = MessageArraySchema.parse(messages)

	// convert client data to chatgpt data
	const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
		role: message.isUserMessage ? 'user' : 'system',
		content: message.text,
	}))

	// insert chatbot prompt along with user messages
	outboundMessages.unshift({
		role: 'system',
		content: chatbotPrompt,
	})

	/* openai stream  */
	const payload: OpenAIStreamPayload = {
		model: 'gpt-3.5-turbo',
		messages: outboundMessages,
		// temparature: float 0-1. Closer to 0 means the model will repeat itself more often. Closer to 1 means the model will be more random.
		temperature: 0.4,
		top_p: 1,
		// top_p: float 0-1. Closer to 0 means the model will only pick the most likely words, closer to 1 means the model will pick a more diverse set of words.
		frequency_penalty: 0,
		presence_penalty: 0,
		// max_tokens is an integer. It is the maximum number of tokens to generate. The model will stop generating tokens once it hits this number.
		max_tokens: 150,
		stream: true,
		n: 1, // number of responses to generate. The model will stop generating responses once it hits this number.
	}

	const stream = await OpenAIStream(payload)

	//
	return new Response(stream)
}

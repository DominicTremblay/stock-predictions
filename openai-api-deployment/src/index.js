import OpenAI from 'openai';


const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request, env, ctx) {


		if (request.method === 'OPTIONS') {
			return new Response(null, {headers: corsHeaders});
		}

		const openai = new OpenAI({
			apiKey: env.OPEN_API_KEY,
		});

		try {
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4',
				messages: [
					{ role: 'system', content: 'You are a helpful assistant.' },
					{ role: 'user', content: 'What is prompt injection?' },
				],
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
			});

			const response = chatCompletion.choices[0].message.content;

			return new Response(JSON.stringify(response), {headers: corsHeaders});
		} catch (error) {
			return new Response(error, {headers: corsHeaders});
		}
	},
};

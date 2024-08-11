import OpenAI from 'openai';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request, env, ctx) {

		// handle CORS preflight request
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/aa2102a8d1245ed3f72b0be0a5503306/stock-predictions/openai',
		});

		try {
			const messages = await request.json();
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4',
				messages: messages,
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
			});

			const response = chatCompletion.choices[0].message;
			return new Response(JSON.stringify(response), { headers: corsHeaders });
		} catch (error) {
			return new Response(error.message, { headers: corsHeaders });
		}
	},
};

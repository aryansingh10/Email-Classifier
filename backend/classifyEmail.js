const axios = require('axios');

async function classifyEmail(emailContent) {
    const maxRetries = 5;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: emailContent }],
            }, {
                headers: {
                    'Authorization': `Bearer YOUR_API_KEY`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                const retryAfter = error.response.headers['retry-after'] || (2 ** i) * 1000;
                console.log(`Rate limit exceeded. Retrying in ${retryAfter} ms...`);
                await delay(retryAfter);
            } else {
                throw error;
            }
        }
    }

    throw new Error('Max retries exceeded');
}

module.exports = classifyEmail;

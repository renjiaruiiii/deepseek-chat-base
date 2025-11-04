// DeepSeek API 封装：对接真实接口
export const fetchDeepseekResponse = async (message, chatId) => {
    try {
        const response = await fetch('https://metahk.zenymes.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-84i3AD6d32BrfqCO0F9NLN6kaO1ye1hU5gttw0k4xJUeCIvi' // 替换为你的 API 密钥
            },
            body: JSON.stringify({
                model: 'gpt-4.1-mini',
                messages: [{ role: 'user', content: message }],
                stream: false
            })
        });
        const data = await response.json();
        return { reply: data.choices[0].message.content };
    } catch (error) {
        console.error('DeepSeek API 调用失败：', error);
        throw error;
    }
};
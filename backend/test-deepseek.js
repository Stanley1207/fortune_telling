require('dotenv').config();
const fetch = require('node-fetch');

const API_KEY = process.env.DEEPSEEK_API_KEY;

async function test() {
    console.log('测试 DeepSeek API...\n');
    
    if (!API_KEY) {
        console.error('❌ 未找到 DEEPSEEK_API_KEY');
        return;
    }
    
    console.log('✅ API Key 已配置');
    console.log('前缀:', API_KEY.substring(0, 10) + '...\n');
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'user', content: '你好，请回复：测试成功' }
                ]
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API 测试成功！');
            console.log('DeepSeek 回复:', data.choices[0].message.content);
        } else {
            const error = await response.text();
            console.error('❌ API 测试失败');
            console.error('状态码:', response.status);
            console.error('错误:', error);
        }
    } catch (error) {
        console.error('❌ 网络错误:', error.message);
    }
}

test();
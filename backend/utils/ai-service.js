/**
 * AI解读服务模块
 * 支持 DeepSeek API（国内可用，无需代理）
 */

// 兼容老版本 Node.js
let fetch;
try {
    fetch = globalThis.fetch || require('node-fetch');
} catch (e) {
    fetch = require('node-fetch');
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * 构建系统提示词
 */
function buildSystemPrompt() {
    return `你是一位专业的八字命理分析师，擅长用现代、通俗易懂的语言解读传统命理。

你的解读风格：
1. 清晰简洁，避免过度专业的术语
2. 积极正面，给予建设性建议
3. 客观中立，不做绝对性预测
4. 内容仅供娱乐参考

重要约束：
- 禁止提供绝对性预测（如"你必定会..."）
- 禁止提供医疗建议
- 禁止提供投资建议
- 禁止提供法律建议
- 使用"可能"、"倾向"、"建议"等词汇`;
}

/**
 * 构建用户提示词
 */
function buildUserPrompt(baziData, gender) {
    const { pillars, elements, dayMaster } = baziData;
    
    return `请基于以下八字信息进行解读：

【基本信息】
性别：${gender === 'male' ? '男' : '女'}

【四柱八字】
年柱：${pillars.year.heavenly}${pillars.year.earthly}
月柱：${pillars.month.heavenly}${pillars.month.earthly}
日柱：${pillars.day.heavenly}${pillars.day.earthly}（日主）
时柱：${pillars.hour.heavenly}${pillars.hour.earthly}

【五行分布】
木：${elements.木}  火：${elements.火}  土：${elements.土}  金：${elements.金}  水：${elements.水}

【日主】
${dayMaster}

请按以下格式输出（每个部分150字左右，使用自然段落）：

## 总体概况
[概述这个八字的整体特点和气质]

## 性格特征
[分析性格倾向和行为特点]

## 感情运势
[解读感情方面的特点和建议]

## 事业运势
[分析适合的职业方向和发展建议]

## 财运趋势
[解读财运特点和理财建议]

## 健康提示
[提供健康方面的关注点，但不做医疗诊断]`;
}

/**
 * 解析AI返回的内容
 */
function parseInterpretation(text) {
    const sections = {
        overview: '',
        personality: '',
        love: '',
        career: '',
        wealth: '',
        health: ''
    };
    
    const sectionMap = {
        '总体概况': 'overview',
        '性格特征': 'personality',
        '感情运势': 'love',
        '事业运势': 'career',
        '财运趋势': 'wealth',
        '健康提示': 'health'
    };
    
    // 按标题分割内容
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    for (const line of lines) {
        // 检查是否是标题
        let isTitle = false;
        for (const [title, key] of Object.entries(sectionMap)) {
            if (line.includes(title)) {
                // 保存上一个section
                if (currentSection) {
                    sections[currentSection] = currentContent.join('\n').trim();
                }
                currentSection = key;
                currentContent = [];
                isTitle = true;
                break;
            }
        }
        
        // 如果不是标题且有当前section，添加到内容
        if (!isTitle && currentSection && line.trim()) {
            // 过滤掉##标记
            const cleanLine = line.replace(/^##\s*/, '').trim();
            if (cleanLine) {
                currentContent.push(cleanLine);
            }
        }
    }
    
    // 保存最后一个section
    if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
    }
    
    return sections;
}

/**
 * 调用 DeepSeek API 获取解读
 */
async function getAIInterpretation(baziData, gender) {
    if (!DEEPSEEK_API_KEY) {
        console.warn('⚠️  未设置DEEPSEEK_API_KEY，使用模拟数据');
        return getMockInterpretation();
    }
    
    try {
        console.log('🤖 开始调用DeepSeek API...');
        
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(baziData, gender);
        
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API请求失败: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        // DeepSeek API 响应格式（类似 OpenAI）
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('API响应格式错误: ' + JSON.stringify(data));
        }
        
        const text = data.choices[0].message.content;
        
        console.log('✅ DeepSeek API调用成功');
        
        return parseInterpretation(text);
        
    } catch (error) {
        console.error('❌ AI解读失败:', error.message);
        console.log('📝 返回模拟数据');
        return getMockInterpretation();
    }
}

/**
 * 模拟数据（用于测试）
 */
function getMockInterpretation() {
    return {
        overview: '您的八字显示出独特的能量组合，五行之间相互作用形成了您特有的命理格局。整体而言，您是一个内心丰富、思维活跃的人，具有较强的适应能力和学习能力。命局中蕴含着丰富的可能性，建议您在人生道路上保持开放的心态，善于把握机遇。',
        
        personality: '您的性格中兼具理性与感性的特质。在处理事务时，您倾向于深思熟虑，不轻易做出决定。同时，您对美好事物有着敏锐的感知力，富有创造力和想象力。在人际交往中，您可能显得有些内敛，但一旦建立信任，便会展现出真诚和温暖的一面。建议您在保持独立思考的同时，也要适当表达自己的想法和情感。',
        
        love: '在感情方面，您是一个重视精神契合的人，相比外在条件，更看重双方的价值观和生活理念是否一致。您倾向于稳定、深刻的情感关系，对感情专一且负责。建议在感情中保持真诚沟通，不要因为顾虑太多而错失良缘。对于已有伴侣的人，建议多花时间了解对方的内心世界，共同成长。',
        
        career: '在事业发展上，您适合需要思考、分析和创造力的工作领域。可以考虑文化、教育、咨询、设计或技术类的职业方向。您具备持续学习和自我提升的能力，这将成为您职业发展的重要优势。建议您选择能够发挥自身特长的领域，不要过分追求外界的认可，而是专注于自己的成长和价值创造。',
        
        wealth: '财运方面，您更适合通过稳定的工作和技能积累来获得收益，而不是投机性的财富增长。建议您建立长期的理财规划，注重积累而非快速致富。在消费观念上，您可能比较理性，懂得节制，这是很好的品质。同时也建议适度投资自己，提升专业能力将带来更好的回报。',
        
        health: '健康方面，建议您注意劳逸结合，避免长期的精神压力。定期进行户外活动和运动，有助于保持身心平衡。在饮食上，建议规律作息，避免过度劳累。同时，保持良好的心态对健康至关重要，遇到问题时不要过度焦虑，学会适当放松和调节。如有健康问题，请及时咨询专业医生。'
    };
}

module.exports = {
    getAIInterpretation
};
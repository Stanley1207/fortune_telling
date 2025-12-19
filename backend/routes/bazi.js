const express = require('express');
const router = express.Router();
const { calculateBazi } = require('../utils/bazi-calculator');
const { getAIInterpretation } = require('../utils/ai-service');

// 八字计算和解读接口
router.post('/calculate', async (req, res) => {
    try {
        const { birthdate, calendarType, birthTime, gender, city } = req.body;

        // 验证必填参数
        if (!birthdate || !birthTime || !gender) {
            return res.status(400).json({
                error: '缺少必填参数',
                required: ['birthdate', 'birthTime', 'gender']
            });
        }

        console.log('收到请求:', { birthdate, calendarType, birthTime, gender, city });

        // 1. 计算八字
        const baziData = calculateBazi({
            birthdate,
            calendarType,
            birthTime,
            gender,
            city
        });

        console.log('八字计算完成');

        // 2. 调用AI解读
        const interpretation = await getAIInterpretation(baziData, gender);

        console.log('AI解读完成');

        // 3. 返回结果
        res.json({
            success: true,
            pillars: baziData.pillars,
            elements: baziData.elements,
            interpretation: interpretation
        });

    } catch (error) {
        console.error('计算错误:', error);
        res.status(500).json({
            error: '计算失败，请重试',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
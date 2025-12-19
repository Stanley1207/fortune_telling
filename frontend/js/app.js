/**
 * AI八字算命 - 前端主逻辑
 */

// 页面元素
const homepage = document.getElementById('homepage');
const loadingPage = document.getElementById('loading-page');
const resultPage = document.getElementById('result-page');
const form = document.getElementById('bazi-form');
const pillarsDisplay = document.getElementById('pillars-display');
const aiInterpretation = document.getElementById('ai-interpretation');
const recalculateBtn = document.getElementById('recalculate-btn');

// 日志工具
function log(message, data) {
    if (CONFIG.DEBUG) {
        console.log(`[八字App] ${message}`, data || '');
    }
}

// 页面切换函数
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
    log('切换页面:', page.id);
}

// 渲染四柱
function renderPillars(pillars) {
    const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
    const pillarData = [
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
    ];

    pillarsDisplay.innerHTML = pillarData.map((pillar, index) => `
        <div class="pillar">
            <div class="pillar-title">${pillarNames[index]}</div>
            <div class="pillar-chars">
                <div class="pillar-char">${pillar.heavenly}</div>
                <div class="pillar-char">${pillar.earthly}</div>
            </div>
        </div>
    `).join('');
    
    log('四柱渲染完成', pillars);
}

// 渲染AI解读
function renderInterpretation(interpretation) {
    const sections = [
        { title: '总体概况', content: interpretation.overview },
        { title: '性格特征', content: interpretation.personality },
        { title: '感情运势', content: interpretation.love },
        { title: '事业运势', content: interpretation.career },
        { title: '财运趋势', content: interpretation.wealth },
        { title: '健康提示', content: interpretation.health }
    ];

    aiInterpretation.innerHTML = sections.map(section => `
        <div class="interpretation-section">
            <h3 class="section-title">${section.title}</h3>
            <p class="section-content">${section.content}</p>
        </div>
    `).join('');
    
    log('AI解读渲染完成');
}

// 显示错误提示
function showError(message) {
    alert(`❌ ${message}\n\n请检查：\n1. 后端服务是否启动\n2. 网络连接是否正常\n3. API密钥是否配置正确`);
}

// 表单提交处理
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        birthdate: document.getElementById('birthdate').value,
        calendarType: document.getElementById('calendar-type').value,
        birthTime: document.getElementById('birth-time').value,
        gender: document.getElementById('gender').value,
        city: document.getElementById('city').value || ''
    };

    // 验证
    if (!formData.birthdate || !formData.birthTime || !formData.gender) {
        alert('请填写所有必填项');
        return;
    }

    log('提交表单', formData);

    try {
        // 显示加载页
        showPage(loadingPage);

        // 调用API
        log('调用API:', CONFIG.API_BASE_URL + '/calculate');
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        log('API响应成功', result);

        // 渲染结果
        renderPillars(result.pillars);
        renderInterpretation(result.interpretation);

        // 显示结果页
        showPage(resultPage);

    } catch (error) {
        console.error('❌ 请求失败:', error);
        showError(error.message || '解读失败，请稍后重试');
        showPage(homepage);
    }
});

// 重新测算
recalculateBtn.addEventListener('click', () => {
    log('重新测算');
    showPage(homepage);
    form.reset();
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置今天日期为最大值
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('birthdate').setAttribute('max', today);
    
    log('应用初始化完成');
    log('API地址:', CONFIG.API_BASE_URL);
});
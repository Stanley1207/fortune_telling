/**
 * 八字排盘计算模块 - 准确版本
 * 使用 lunar-javascript 库进行精确计算
 */

const { Solar, Lunar } = require('lunar-javascript');

// 天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 时辰对应地支
const TIME_TO_BRANCH = {
    '23-01': '子',
    '01-03': '丑',
    '03-05': '寅',
    '05-07': '卯',
    '07-09': '辰',
    '09-11': '巳',
    '11-13': '午',
    '13-15': '未',
    '15-17': '申',
    '17-19': '酉',
    '19-21': '戌',
    '21-23': '亥'
};

// 五行属性
const ELEMENT_MAP = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '子': '水', '丑': '土',
    '寅': '木', '卯': '木',
    '辰': '土', '巳': '火',
    '午': '火', '未': '土',
    '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
};

/**
 * 获取时辰（根据时间范围字符串）
 */
function getHourBranch(timeRange) {
    return TIME_TO_BRANCH[timeRange] || '子';
}

/**
 * 将时间范围转换为具体小时
 */
function parseTimeRange(timeRange) {
    const startHour = parseInt(timeRange.split('-')[0]);
    return startHour === 23 ? 23 : startHour;
}

/**
 * 计算五行分布
 */
function calculateElements(pillars) {
    const elements = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    
    Object.values(pillars).forEach(pillar => {
        const heavenlyElement = ELEMENT_MAP[pillar.heavenly];
        const earthlyElement = ELEMENT_MAP[pillar.earthly];
        elements[heavenlyElement]++;
        elements[earthlyElement]++;
    });
    
    return elements;
}

/**
 * 获取五行纳音
 */
function getNayin(heavenly, earthly) {
    const nayin = {
        '甲子': '海中金', '乙丑': '海中金',
        '丙寅': '炉中火', '丁卯': '炉中火',
        '戊辰': '大林木', '己巳': '大林木',
        '庚午': '路旁土', '辛未': '路旁土',
        '壬申': '剑锋金', '癸酉': '剑锋金',
        '甲戌': '山头火', '乙亥': '山头火',
        '丙子': '涧下水', '丁丑': '涧下水',
        '戊寅': '城头土', '己卯': '城头土',
        '庚辰': '白蜡金', '辛巳': '白蜡金',
        '壬午': '杨柳木', '癸未': '杨柳木',
        '甲申': '泉中水', '乙酉': '泉中水',
        '丙戌': '屋上土', '丁亥': '屋上土',
        '戊子': '霹雳火', '己丑': '霹雳火',
        '庚寅': '松柏木', '辛卯': '松柏木',
        '壬辰': '长流水', '癸巳': '长流水',
        '甲午': '砂中金', '乙未': '砂中金',
        '丙申': '山下火', '丁酉': '山下火',
        '戊戌': '平地木', '己亥': '平地木',
        '庚子': '壁上土', '辛丑': '壁上土',
        '壬寅': '金箔金', '癸卯': '金箔金',
        '甲辰': '覆灯火', '乙巳': '覆灯火',
        '丙午': '天河水', '丁未': '天河水',
        '戊申': '大驿土', '己酉': '大驿土',
        '庚戌': '钗钏金', '辛亥': '钗钏金',
        '壬子': '桑柘木', '癸丑': '桑柘木',
        '甲寅': '大溪水', '乙卯': '大溪水',
        '丙辰': '沙中土', '丁巳': '沙中土',
        '戊午': '天上火', '己未': '天上火',
        '庚申': '石榴木', '辛酉': '石榴木',
        '壬戌': '大海水', '癸亥': '大海水'
    };
    
    const key = heavenly + earthly;
    return nayin[key] || '未知';
}

/**
 * 根据日干和时支推算时干
 * 五鼠遁日起时法
 */
function getHourGanIndex(dayGanIndex, hourZhiIndex) {
    // 时干起法口诀：
    // 甲己还加甲，乙庚丙作初
    // 丙辛从戊起，丁壬庚子居
    // 戊癸何方发，壬子是真途
    
    const baseGan = {
        0: 0,  // 甲日从甲开始
        1: 2,  // 乙日从丙开始
        2: 4,  // 丙日从戊开始
        3: 6,  // 丁日从庚开始
        4: 8,  // 戊日从壬开始
        5: 0,  // 己日从甲开始
        6: 2,  // 庚日从丙开始
        7: 4,  // 辛日从戊开始
        8: 6,  // 壬日从庚开始
        9: 8   // 癸日从壬开始
    };
    
    const base = baseGan[dayGanIndex];
    const ganIndex = (base + hourZhiIndex) % 10;
    
    return ganIndex;
}

/**
 * 主函数：计算完整八字
 */
function calculateBazi({ birthdate, calendarType, birthTime, gender, city }) {
    try {
        const date = new Date(birthdate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript月份从0开始
        const day = date.getDate();
        const hour = parseTimeRange(birthTime);
        
        console.log(`📅 输入日期: ${year}-${month}-${day} ${hour}:00 (${calendarType})`);
        
        // 创建Solar对象（公历）
        let solar;
        let lunar;
        
        if (calendarType === 'lunar') {
            // 如果是农历，先转换为农历对象，再获取公历
            lunar = Lunar.fromYmd(year, month, day);
            solar = lunar.getSolar();
            console.log(`🔄 农历转公历: ${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`);
        } else {
            // 公历
            solar = Solar.fromYmd(year, month, day);
            lunar = solar.getLunar();
        }
        
        // 获取八字
        const eightChar = lunar.getEightChar();
        
        // 年柱
        const yearGan = eightChar.getYearGan();
        const yearZhi = eightChar.getYearZhi();
        
        // 月柱
        const monthGan = eightChar.getMonthGan();
        const monthZhi = eightChar.getMonthZhi();
        
        // 日柱
        const dayGan = eightChar.getDayGan();
        const dayZhi = eightChar.getDayZhi();
        
        // 时柱 - 使用用户选择的时辰
        const hourZhi = getHourBranch(birthTime);
        const hourZhiIndex = EARTHLY_BRANCHES.indexOf(hourZhi);
        
        // 根据日干推算时干（五鼠遁日起时法）
        const dayGanIndex = HEAVENLY_STEMS.indexOf(dayGan);
        const hourGanIndex = getHourGanIndex(dayGanIndex, hourZhiIndex);
        const hourGan = HEAVENLY_STEMS[hourGanIndex];
        
        // 构建四柱
        const pillars = {
            year: {
                heavenly: yearGan,
                earthly: yearZhi,
                nayin: getNayin(yearGan, yearZhi)
            },
            month: {
                heavenly: monthGan,
                earthly: monthZhi,
                nayin: getNayin(monthGan, monthZhi)
            },
            day: {
                heavenly: dayGan,
                earthly: dayZhi,
                nayin: getNayin(dayGan, dayZhi)
            },
            hour: {
                heavenly: hourGan,
                earthly: hourZhi,
                nayin: getNayin(hourGan, hourZhi)
            }
        };
        
        // 计算五行
        const elements = calculateElements(pillars);
        
        // 获取农历信息
        const lunarYear = lunar.getYear();
        const lunarMonth = lunar.getMonth();
        const lunarDay = lunar.getDay();
        const lunarMonthName = lunar.getMonthInChinese();
        const lunarDayName = lunar.getDayInChinese();
        
        // 获取节气信息
        const jieQi = lunar.getCurrentJieQi();
        const nextJieQi = lunar.getNextJieQi();
        
        console.log(`✅ 八字计算完成: ${yearGan}${yearZhi} ${monthGan}${monthZhi} ${dayGan}${dayZhi} ${hourGan}${hourZhi}`);
        
        return {
            pillars,
            elements,
            dayMaster: dayGan, // 日主（日干）
            gender,
            lunar: {
                year: lunarYear,
                month: lunarMonth,
                day: lunarDay,
                monthName: lunarMonthName,
                dayName: lunarDayName,
                yearInChinese: lunar.getYearInChinese(),
                yearInGanZhi: lunar.getYearInGanZhi()
            },
            solar: {
                year: solar.getYear(),
                month: solar.getMonth(),
                day: solar.getDay()
            },
            jieQi: {
                current: jieQi ? jieQi.getName() : '未知',
                next: nextJieQi ? nextJieQi.getName() : '未知'
            },
            birthInfo: {
                date: birthdate,
                calendarType,
                time: birthTime,
                city
            }
        };
        
    } catch (error) {
        console.error('❌ 八字计算错误:', error);
        throw new Error('八字计算失败: ' + error.message);
    }
}

module.exports = {
    calculateBazi,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    ELEMENT_MAP
};
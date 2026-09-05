console.log('✅ 推送模块 sendNotify.js 已成功加载');
// sendNotify.js - 多合一推送模块
const axios = require('axios');

async function sendNotify(title, content) {
    console.log(`📢 尝试推送通知: ${title}`);
    let success = false;

    // 1. PushPlus 推送（微信模板消息，推荐）
    let pushplusToken = process.env.PUSH_PLUS_TOKEN;
    if (pushplusToken) {
        try {
            await axios.post('https://www.pushplus.plus/send', {
                token: pushplusToken,
                title: title,
                content: content
            });
            console.log('✅ PushPlus 推送成功');
            success = true;
        } catch (e) {
            console.log('❌ PushPlus 推送失败:', e.message);
        }
    }

    // 2. Server酱 推送（微信旧版）
    let sckey = process.env.SCKEY;
    if (sckey) {
        try {
            await axios.post(`https://sctapi.ftqq.com/${sckey}.send`, {
                title: title,
                desp: content
            });
            console.log('✅ Server酱 推送成功');
            success = true;
        } catch (e) {
            console.log('❌ Server酱 推送失败:', e.message);
        }
    }

    // 3. Bark 推送（iOS设备）
    let barkUrl = process.env.BARK;
    if (barkUrl) {
        try {
            await axios.get(`${barkUrl}/${encodeURIComponent(title)}/${encodeURIComponent(content)}`);
            console.log('✅ Bark 推送成功');
            success = true;
        } catch (e) {
            console.log('❌ Bark 推送失败:', e.message);
        }
    }

    // 4. Telegram Bot 推送
    let tgBotToken = process.env.TG_BOT_TOKEN;
    let tgChatId = process.env.TG_CHAT_ID;
    if (tgBotToken && tgChatId) {
        try {
            await axios.post(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
                chat_id: tgChatId,
                text: `${title}\n\n${content}`,
                parse_mode: 'Markdown'
            });
            console.log('✅ Telegram 推送成功');
            success = true;
        } catch (e) {
            console.log('❌ Telegram 推送失败:', e.message);
        }
    }

    if (!success) {
        console.log('ℹ️ 未配置任何推送渠道，结果仅输出在日志中。');
    }
}

module.exports = { sendNotify };

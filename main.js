const { loginWithAllAccounts } = require("./services/login");
const { register } = require("./services/register");
const { sendHeartbeat } = require("./services/heartbeat");
const { runNodeTests, fetchBaseUrl } = require("./services/nodes");
const { askQuestion } = require("./utils/userInput");
const { banner } = require("./utils/banner");
const { logger } = require("./utils/logger");

let baseUrl = 'https://api.pipecdn.app'

// 确保基础URL已初始化
async function ensureBaseUrl() {
    if (!baseUrl || baseUrl === 'https://api.pipecdn.app') {
        logger('Initializing base URL...');
        baseUrl = await fetchBaseUrl(baseUrl);
        logger('Base URL initialized to:', 'info', baseUrl);
        return baseUrl;
    }
}

(async () => {
    logger(banner, "debug");

    // 定期刷新基础URL
    setInterval(async () => {
        baseUrl = await fetchBaseUrl();
        logger('Base URL refreshed:', baseUrl);
    }, 60 * 60 * 1000); // Every 60 minutes

    while (true) {
        const choice = await askQuestion(
            "请选择操作：\n1. 注册\n2. 登录\n3. 运行节点\n4. 退出\n> "
        );

        switch (choice) {
            case "1":
                baseUrl = await ensureBaseUrl();
                logger("正在注册新账户...");
                await register(baseUrl);
                break;
            case "2":
                baseUrl = await ensureBaseUrl();
                logger("正在从accounts.json读取账户并登录...");
                await loginWithAllAccounts(baseUrl);
                break;
            case "3":
                baseUrl = await ensureBaseUrl();
                logger("正在使用代理运行所有账户...");
                
                // 首次运行
                await sendHeartbeat(baseUrl);
                await runNodeTests(baseUrl);
                
                // 设置定时任务
                setInterval(() => sendHeartbeat(baseUrl), 6 * 60 * 60 * 1000); // 每6小时
                setInterval(() => runNodeTests(baseUrl), 30 * 60 * 1000); // 每30分钟
                
                logger("程序已进入后台运行模式", "info");
                logger("心跳将每6小时发送一次，节点结果将每30分钟发送一次", "debug");
                logger("请不要修改此设置，否则您的账户可能会被封禁。", "debug");
                
                // 保持程序运行但不返回主菜单
                while (true) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            case "4":
                logger("程序退出。", "info");
                process.exit(0);
            default:
                logger("无效选择，请重新选择。", "error");
        }
    }
})();

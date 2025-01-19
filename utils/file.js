const fs = require("fs").promises;
const { logger } = require("./logger");
const TOKEN_FILE = "tokenz.json";

// 保存token的函数
async function saveToken(data) {
    try {
        let tokens = [];
        try {
            const fileData = await fs.readFile(TOKEN_FILE, 'utf8');
            tokens = JSON.parse(fileData);
        } catch (error) {
            logger("未找到之前的token", "error");
        }

        const tokenIndex = tokens.findIndex(token => token.username === data.username);

        if (tokenIndex !== -1) {
            tokens[tokenIndex] = data;
            logger(`用户 ${data.username} 的token已更新`);
        } else {
            tokens.push(data);
            logger(`用户 ${data.username} 的token已添加`);
        }

        await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
        logger('Token保存成功!', "success");

    } catch (error) {
        logger('保存token时出错:', "error", error);
    }
}

// 读取所有保存的token
async function readToken() {
    try {
        const data = await fs.readFile(TOKEN_FILE, "utf8");
        return JSON.parse(data);
    } catch {
        logger("未找到token，请先登录", "error");
        process.exit(1);
    }
}

// 从文件加载代理
async function loadProxies() {
    try {
        const data = await fs.readFile('proxy.txt', 'utf8');
        return data.split('\n').filter(proxy => proxy.trim() !== '');
    } catch (error) {
        logger('读取代理文件时出错:', "error", error);
        return [];
    }
}

const headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}
module.exports = { saveToken, readToken, loadProxies, headers };

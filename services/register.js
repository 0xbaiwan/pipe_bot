const fetch = require('node-fetch');
const fs = require('fs');
const readlineSync = require('readline-sync');
const { HttpsProxyAgent } = require("https-proxy-agent");
const { logger } = require("../utils/logger");
const { loadProxies, headers } = require("../utils/file");

const ACCOUNT_FILE = 'account.json';

// 使用指定代理注册新用户
async function registerUser(email, password, proxy, API_URL) {
    try {
        const options = {
            method: 'POST',
            headers: {
                ...headers,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                referralCode: "bWVuZ2Nob2",
            }),
        };

        if (proxy) {
            options.agent = new HttpsProxyAgent(proxy);
        }

        const response = await fetch(`${API_URL}/api/signup`, options);

        if (response.ok) {
            const data = await response.text();
            if (data) {
                // Add user to the account.json 
                await addUserToFile(email, password);
                logger('Registration successful!', "success", data);
            } else {
                logger('Registration failed! Please try again.', "error");
            }
        } else {
            const errorText = await response.text();
            logger('Registration error:', "error", errorText);
        }
    } catch (error) {
        logger('Error registering user:', "error", error);
    }
}

// 提示用户输入邮箱和密码
function promptUserForCredentials() {
    const email = readlineSync.question('Enter your email: ');
    const password = readlineSync.question('Enter your password: ', {
        hideEchoBack: true,
    });
    return { email, password };
}

// 将新用户添加到account.json中的数组
async function addUserToFile(email, password) {
    try {
        let fileData = await fs.promises.readFile(ACCOUNT_FILE, 'utf8');
        let users = fileData ? JSON.parse(fileData) : [];
        users.push({ email, password });

        await fs.promises.writeFile(ACCOUNT_FILE, JSON.stringify(users, null, 2));
        logger('User added successfully to file!');
    } catch (error) {
        logger('Error adding user to file:', "error", error);
    }
}

// 执行注册的主函数
async function register(API_URL) {
    const { email, password } = promptUserForCredentials();

    const proxies = await loadProxies();
    const proxy = proxies.length > 0 ? proxies[Math.floor(Math.random() * proxies.length)] : null;
    
    if (proxy) {
        logger(`Using proxy: ${proxy}`);
    } else {
        logger('Registering without proxy');
    }

    await registerUser(email, password, proxy, API_URL);
    return;
}

module.exports = { promptUserForCredentials, register };

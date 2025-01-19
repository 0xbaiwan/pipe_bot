const chalk = require('chalk');

// 带颜色支持的日志记录函数
function logger(message, level = 'info', value = "") {
    const now = new Date().toISOString();
    const colors = {
        info: chalk.green,    // 信息级别 - 绿色
        warn: chalk.yellow,   // 警告级别 - 黄色
        error: chalk.red,     // 错误级别 - 红色
        success: chalk.blue,  // 成功级别 - 蓝色
        debug: chalk.magenta, // 调试级别 - 洋红色
    };
    const color = colors[level] || chalk.white;
    console.log(color(`[${now}] [${level.toUpperCase()}]: ${message}`), chalk.yellow(value));
}

module.exports = { logger };

const chalk = require('chalk');

// 日志级别对应的中文描述
const logLevels = {
    debug: "调试",
    info: "信息",
    warn: "警告", 
    error: "错误",
    success: "成功"
};

// 日志级别对应的颜色
const logColors = {
    debug: chalk.magenta,
    info: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
    success: chalk.blue
};

// 带颜色支持的日志记录函数
function logger(message, level = 'info', value = "") {
    const now = new Date().toISOString();
    const color = logColors[level] || chalk.white;
    const levelText = logLevels[level] || level;
    
    console.log(color(`[${now}] [${levelText.toUpperCase()}]: ${message}`), chalk.yellow(value));
}

module.exports = { logger };

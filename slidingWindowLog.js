// slidingWindowLog.js
const logs = {};

function slidingWindowLog(ip) {
    const now = Date.now();
    const windowSize = 60000; // 1 minuto em milissegundos
    const limit = 5; // Limite de 5 requisições por minuto

    if (!logs[ip]) {
        logs[ip] = [];
    }

    logs[ip] = logs[ip].filter(timestamp => now - timestamp < windowSize);

    if (logs[ip].length < limit) {
        logs[ip].push(now);
        return true;
    } else {
        return false;
    }
}

module.exports = slidingWindowLog;

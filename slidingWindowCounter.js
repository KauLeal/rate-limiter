const counters = {};

function slidingWindowCounter(ip) {
    const now = Date.now();
    const windowSize = 5000; // 5 segundos em milissegundos
    const limit = 5; // Limite de 5 requisições por minuto

    if (!counters[ip]) {
        counters[ip] = {
            currentWindow: Math.floor(now / windowSize) * windowSize,
            currentCount: 0,
            previousWindow: Math.floor(now / windowSize) * windowSize - windowSize,
            previousCount: 0
        };
    }

    const currentWindow = Math.floor(now / windowSize) * windowSize;

    if (counters[ip].currentWindow === currentWindow) {
        counters[ip].currentCount++;
    } else {
        counters[ip].previousWindow = counters[ip].currentWindow;
        counters[ip].previousCount = counters[ip].currentCount;
        counters[ip].currentWindow = currentWindow;
        counters[ip].currentCount = 1;
    }

    const elapsedTime = now - counters[ip].currentWindow;
    const weightCurrent = elapsedTime / windowSize;
    const weightPrevious = 1 - weightCurrent;

    const slidingWindowCount = (counters[ip].currentCount * weightCurrent) + (counters[ip].previousCount * weightPrevious);

    if (slidingWindowCount <= limit) {
        return true;
    } else {
        return false;
    }
}

module.exports = slidingWindowCounter;

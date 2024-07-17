const redis = require('redis');
const client = redis.createClient();

function slidingWindowCounter(ip) {
    const now = Date.now();
    const windowSize = 60000; // 1 minuto em milissegundos
    const limit = 5; // Limite de 5 requisições por minuto
    const currentWindow = Math.floor(now / windowSize) * windowSize;

    return new Promise((resolve, reject) => {
        client.multi()
            .zremrangebyscore(ip, 0, currentWindow - windowSize) // Remover entradas antigas
            .zadd(ip, now, now) // Adicionar a nova entrada
            .zrange(ip, 0, -1) // Obter todas as entradas
            .exec((err, replies) => {
                if (err) {
                    reject(err);
                } else {
                    const requestCounts = replies[2].length;
                    if (requestCounts <= limit) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
    });
}

module.exports = slidingWindowCounter;

const buckets = {};

function tokenBucket(ip) {
    if (!buckets[ip]) {
        buckets[ip] = { tokens: 10, lastRefill: Date.now() };
    }
    
    const bucket = buckets[ip];
    const now = Date.now();
    const timePassed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(10, bucket.tokens + timePassed);
    bucket.lastRefill = now;

    console.log(`IP: ${ip}, Tokens: ${bucket.tokens}`);

    if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        return true;
    } else {
        return false;
    }
}

module.exports = tokenBucket;

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const tokenBucket = require('./tokenBucket');
const fixedWindowCounter = require('./fixedWindowCounter');
const slidingWindowLog = require('./slidingWindowLog');
const slidingWindowCounter = require('./slidingWindowCounter');
const slidingWindowCounterRedis = require('./slidingWindowCounterRedis');



const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 8080;

// Configuração dos middlewares para endpoints HTTP
app.get('/unlimited', (req, res) => {
    res.send("Unlimited! Let's Go!");
});

app.get('/bucketLimited', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`IP: ${ip} - Request to /bucketLimited`);
    if (tokenBucket(ip)) {
        res.send("Limited by Token Bucket");
    } else {
        res.status(429).send("429 Too Many Requests");
    }
});

app.get('/windowLimited', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`IP: ${ip} - Request to /windowLimited`);
    if (fixedWindowCounter(ip)) {
        res.send("Limited by Fixed Window Counter");
    } else {
        res.status(429).send("429 Too Many Requests");
    }
});

app.get('/slidingWindowLimited', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (slidingWindowLog(ip)) {
        res.send("Limited by Sliding Window Log");
    } else {
        res.status(429).send("429 Too Many Requests - Sliding Window Log");
    }
});

app.get('/slidingWindowCounterLimited', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (slidingWindowCounter(ip)) {
        res.send("Limited by Sliding Window Counter");
    } else {
        res.status(429).send("429 Too Many Requests - Sliding Window Counter");
    }
});

// Middleware de Token Bucket para WebSocket
const tokenBucketWS = (ws, req, next) => {
    const ip = req.socket.remoteAddress;
    if (tokenBucket(ip)) {
        next();
    } else {
        ws.send('429 Too Many Requests - Token Bucket');
        ws.close();
    }
};

// Middleware de Fixed Window Counter para WebSocket
const fixedWindowCounterWS = (ws, req, next) => {
    const ip = req.socket.remoteAddress;
    if (fixedWindowCounter(ip)) {
        next();
    } else {
        ws.send('429 Too Many Requests - Fixed Window Counter');
        ws.close();
    }
};

// Middleware de Sliding Window Log para WebSocket
const slidingWindowLogWS = (ws, req, next) => {
    const ip = req.socket.remoteAddress;
    if (slidingWindowLog(ip)) {
        next();
    } else {
        ws.send('429 Too Many Requests - Sliding Window Log');
        ws.close();
    }
};

// Middleware de Sliding Window Counter para WebSocket
const slidingWindowCounterWS = (ws, req, next) => {
    const ip = req.socket.remoteAddress;
    if (slidingWindowCounter(ip)) {
        next();
    } else {
        ws.send('429 Too Many Requests - Sliding Window Counter');
        ws.close();
    }
};



// Configuração do WebSocket
wss.on('connection', (ws, req) => {
    console.log('Client connected');

    // Use middlewares
    tokenBucketWS(ws, req, () => {
        fixedWindowCounterWS(ws, req, () => {
            slidingWindowLogWS(ws, req, () => {
                slidingWindowCounterWS(ws, req, () => {
                    ws.on('message', (message) => {
                        console.log('Received:', message);
                        ws.send(`Server received: ${message}`);
                    });

                    ws.on('close', () => {
                        console.log('Client disconnected');
                    });
                });
            });
        });
    });
});

server.listen(port, () => {
    console.log(`API listening at http://127.0.0.1:${port}`);
});

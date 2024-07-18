const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const tokenBucket = require('./tokenBucket');
const fixedWindowCounter = require('./fixedWindowCounter');
const slidingWindowLog = require('./slidingWindowLog');
//const slidingWindowCounter = require('./slidingWindowCounter');
const slidingWindowCounterRedis = require('./slidingWindowCounterRedis');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 8080;

// Configuração dos middlewares para endpoints HTTP
app.get('/unlimited', (req, res) => {
    res.send("Ilimitado!");
});

app.get('/bucketLimited', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`IP: ${ip} - Request to /bucketLimited`);
    if (tokenBucket(ip)) {
        res.send("Limitado pelo Token Bucket!");
    } else {
        res.status(429).send("Error 429: Too Many Requests");
    }
});

app.get('/windowLimited', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`IP: ${ip} - Request to /windowLimited`);
    if (fixedWindowCounter(ip)) {
        res.send("Limitado pelo Fixed Window Counter!");
    } else {
        res.status(429).send("Error 429: Too Many Requests");
    }
});

app.get('/slidingWindowLimited', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (slidingWindowLog(ip)) {
        res.send("Limitado pelo Sliding Window Log!");
    } else {
        res.status(429).send("Error 429: Too Many Requests");
    }
});

/*
app.get('/slidingWindowCounterLimited', async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    try {
        const allowed = await slidingWindowCounterRedis(ip);
        if (allowed) {
            res.send("Limitado pelo Sliding Window Counter Redis");
        } else {
            res.status(429).send("Error 429: Too Many Requests");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
*/

// Middleware de Sliding Window Counter para WebSocket
const slidingWindowCounterRedisWS = async (ws, req, next) => {
    const ip = req.socket.remoteAddress;
    try {
        const allowed = await slidingWindowCounterRedis(ip);
        if (allowed) {
            next();
        } else {
            ws.send('Error 429: Too Many Requests');
            ws.close();
        }
    } catch (error) {
        ws.send('500 Internal Server Error');
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
                slidingWindowCounterRedisWS(ws, req, () => {
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

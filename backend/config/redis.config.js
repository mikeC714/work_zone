import Redis from "ioredis";

export const redLockRedis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    connectTimeout: 2000,
    commandTimeout: 2200,
    disconnectTimeout: 3200,
    retryStrategy: (times) =>  times > 2 ? null : Math.min(times * 50, 2000),
    keepAlive: 3000
},{
    noDelay: true,
    connectionName: "redlock",
    password: process.env.REDIS_PASS,
});

export const cache = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    connectTimeout: 2000,
    commandTimeout: 4000,
    retryStrategy: (times) => times > 5 ? null : Math.min(times * 100, 2000),
    lazyConnect: true
},{
    password: process.env.REDIS_PASS,
    connectionName: "cache",
    noDelay: true,
});

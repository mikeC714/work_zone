import Redlock from "redlock";
import { redLockRedis } from "./redis.config.js"

export const lock = new Redlock(
    [redLockRedis],
    {
        retryCount: 3,
        retryDelay: 200,
        retryJitter: 100,
        driftFactor: 0.01,
        automaticExtensionThreshold: 500
    }
)
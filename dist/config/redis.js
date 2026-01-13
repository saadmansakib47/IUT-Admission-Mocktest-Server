import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
const portStr = process.env.REDIS_PORT;
const port = portStr ? parseInt(portStr, 10) : 6379;
// Defensive check to avoid NaN in socket configuration
const redisPort = isNaN(port) ? 6379 : port;
const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: redisPort,
        // tls: true // Try enabling if SSL error persists
    }
});
client.on("connect", () => {
    console.log("✅ Redis connecting...");
});
client.on("ready", () => {
    console.log("✅ Redis ready and connected");
});
client.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
await client.connect();
export default client;

import { createClient } from 'redis';
const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
client.on("connect", () => {
    console.log("✅ Redis connected (cloud)");
});
client.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
export default client;

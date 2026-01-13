import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        // tls: true // Try disabling if SSL error persists
    }
});

client.on("connect", () => {
    console.log("✅ Redis connecting...");
});

client.on("ready", () => {
    console.log("✅ Redis ready and connected");
});

client.on("error", (err: any) => {
    console.error("❌ Redis error:", err);
});

await client.connect();

export default client;
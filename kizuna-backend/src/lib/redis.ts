import Redis from 'ioredis'

const client = new Redis({
    port: 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER, 
    tls: { rejectUnauthorized: false} 
  });

client.on('connect', () => console.log('✅ Connected to Redis'));
client.on('error', (err) => console.error('❌ Redis Error:', err));

export default client
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const client = new ioredis_1.default({
    port: parseInt(process.env.REDIS_PORT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER, // Optional, depending on your Redis setup
    tls: {} // Enable secure connection (rediss://)
});
client.on('connect', () => console.log('✅ Connected to Redis'));
client.on('error', (err) => console.error('❌ Redis Error:', err));
exports.default = client;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqClient = void 0;
const axios_1 = __importDefault(require("axios"));
class GroqClient {
    apiKey;
    baseUrl;
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || '';
        this.baseUrl = process.env.GROQ_API_ENDPOINT || '';
    }
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }
    async analyze(prompt, options = {}) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/completions`, {
                model: 'llama3-70b-8192',
                messages: [{ role: 'user', content: prompt }],
                ...options
            }, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            console.error('GROQ API Error:', error);
            throw error;
        }
    }
}
exports.groqClient = new GroqClient();
//# sourceMappingURL=groqClient.js.map
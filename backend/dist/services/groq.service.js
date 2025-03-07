"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqService = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
class GroqService {
    groq;
    constructor() {
        this.groq = new groq_sdk_1.default({
            apiKey: process.env.GROQ_API_KEY
        });
    }
    async getCompletion(prompt) {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama3-70b-8192',
            });
            return completion.choices[0]?.message?.content || 'No response generated';
        }
        catch (error) {
            console.error('Error calling Groq:', error);
            throw error;
        }
    }
}
exports.GroqService = GroqService;
//# sourceMappingURL=groq.service.js.map
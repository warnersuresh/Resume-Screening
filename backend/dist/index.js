"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const groq_service_1 = require("./services/groq.service");
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const analysisRoutes_1 = __importDefault(require("./routes/analysisRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const groqService = new groq_service_1.GroqService();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', uploadRoutes_1.default);
app.use('/api', analysisRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});
app.post('/api/prompt', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const response = await groqService.getCompletion(prompt);
        res.json({ response });
    }
    catch (error) {
        console.error('Error processing prompt:', error);
        res.status(500).json({ error: 'Failed to process prompt' });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map
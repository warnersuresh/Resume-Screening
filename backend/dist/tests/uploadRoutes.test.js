"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const PDFService_1 = require("../services/PDFService");
const uploadRoutes_1 = __importDefault(require("../routes/uploadRoutes"));
const path_1 = __importDefault(require("path"));
jest.mock('../services/PDFService');
describe('Upload Routes', () => {
    let app;
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use('/api', uploadRoutes_1.default);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should successfully upload and parse PDF', async () => {
        const mockExtractText = jest.spyOn(PDFService_1.PDFService.prototype, 'extractText')
            .mockResolvedValue('Extracted text from PDF');
        const mockCleanup = jest.spyOn(PDFService_1.PDFService.prototype, 'cleanup')
            .mockResolvedValue();
        const response = await (0, supertest_1.default)(app)
            .post('/api/upload')
            .attach('resume', path_1.default.join(__dirname, '../tests/fixtures/test.pdf'));
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('text', 'Extracted text from PDF');
        console.log(response.body);
        expect(mockExtractText).toHaveBeenCalled();
        expect(mockCleanup).toHaveBeenCalled();
    });
    it('should return 400 if no file is uploaded', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/api/upload')
            .send();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
});
//# sourceMappingURL=uploadRoutes.test.js.map
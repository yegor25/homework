"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const settings_1 = require("../src/settings");
describe("/videos", () => {
    // beforeAll(async () => {
    //     await request(app).delete('__tests__/data')
    // })
    it('get all videos return st200', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, supertest_1.default)(settings_1.app)
            .get("/videos");
        expect(data.status).toBe(200);
    }));
    it("get one element by id which doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, supertest_1.default)(settings_1.app)
            .get(`/videos/${1}`);
        expect(data.status).toBe(404);
    }));
    it("post video without title", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, supertest_1.default)(settings_1.app)
            .post("/videos")
            .send({ title: "", author: "" });
        expect(data.status).toBe(400);
    }));
});


import request from "supertest"
import { app } from "../src/settings"

describe("/videos", () => {
    // beforeAll(async () => {
    //     await request(app).delete('__tests__/data')
    // })
    it('get all videos return st200', async () => {
        const data = await request(app)
            .get("/videos")
            expect(data.status).toBe(200)
    })
    it("get one element by id which doesn't exist", async() => {
        const data = await request(app)
        .get(`/videos/${1}`)
        expect(data.status).toBe(404)

    })
    it("post video without title", async () => {
        const data = await request(app)
        .post("/videos")
        .send({title: "", author: ""})
        expect(data.status).toBe(400)
    })
})
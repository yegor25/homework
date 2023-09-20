"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = 3000;
settings_1.app.delete("/__tests__/data", (req, res) => {
    res.sendStatus(204);
});
settings_1.app.get("/", (req, res) => {
    res.send("hello samurai");
});
settings_1.app.listen(port, () => {
    console.log(`server runnung... on ${port} port`);
});

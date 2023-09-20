"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
var AvailableResolutions;
(function (AvailableResolutions) {
    AvailableResolutions["P144"] = "P144";
    AvailableResolutions["P240"] = "P240";
    AvailableResolutions["P360"] = "P360";
    AvailableResolutions["P480"] = "P480";
    AvailableResolutions["P720"] = "P720";
    AvailableResolutions["P1080"] = "P1080";
    AvailableResolutions["P1440"] = "P1440";
    AvailableResolutions["P2160"] = "P2160";
})(AvailableResolutions || (AvailableResolutions = {}));
const videoDb = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023 -09 - 19T08: 34: 24.872Z",
        publicationDate: "2023 -09 - 19T08: 34: 24.872Z",
        availableResolutions: [
            AvailableResolutions.P144
        ]
    }
];
exports.app.delete("/testing/all-data", (req, res) => {
    videoDb.length = 0;
    res.sendStatus(204);
});
exports.app.get("/videos", (req, res) => {
    res.send(videoDb);
});
exports.app.get("/videos/:id", (req, res) => {
    const id = +req.params.id;
    const video = videoDb.find(el => el.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(video);
    }
});
exports.app.post("/videos", (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: "invalid title", field: "title" });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: "invalid author", field: "author" });
    }
    if (Array.isArray(availableResolutions) && availableResolutions.length) {
        availableResolutions.map(el => !AvailableResolutions[el] && errors.errorsMessages.push({
            message: "invalid availbale resolutions",
            field: "availableResolutions"
        }));
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    else {
        const createdAtDate = new Date();
        const publicationDate = new Date();
        publicationDate.setDate(createdAtDate.getDate() + 1);
        const newVideo = {
            id: +new Date(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAtDate.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions
        };
        videoDb.push(newVideo);
        res.status(201).send(newVideo);
    }
});
exports.app.delete("/videos/:id", (req, res) => {
    const id = +req.params.id;
    const videoIndex = videoDb.findIndex(el => el.id === id);
    if (videoIndex < 0) {
        res.sendStatus(404);
        return;
    }
    else {
        videoDb.splice(videoIndex, 1);
        res.sendStatus(204);
    }
});
exports.app.put("/videos/:id", (req, res) => {
    const id = +req.params.id;
    const errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    const modifyVideoIndex = videoDb.findIndex(el => el.id === id);
    if (modifyVideoIndex < 0) {
        res.sendStatus(404);
        return;
    }
    else {
        if (!title || title.trim().length > 40 || !title.length) {
            errors.errorsMessages.push({ message: "invalid title", field: "title" });
        }
        if (!author || author.trim().length > 40 || !author.length) {
            errors.errorsMessages.push({ message: "invalid author", field: "author" });
        }
        if (Array.isArray(availableResolutions) && availableResolutions.length) {
            availableResolutions.map(el => !AvailableResolutions[el] && errors.errorsMessages.push({
                message: "invalid availbale resolutions",
                field: "availableResolutions"
            }));
        }
        else {
            availableResolutions = [];
        }
        if (canBeDownloaded && typeof (canBeDownloaded) !== "boolean") {
            errors.errorsMessages.push({
                message: "bad type of canBeDownLoaded, type of canBeDownLoaded must be boolean",
                field: "canBeDownLoaded"
            });
        }
        else {
            canBeDownloaded = true;
        }
        if (!minAgeRestriction || minAgeRestriction < 0 || minAgeRestriction > 18 || typeof (minAgeRestriction) !== "number") {
            errors.errorsMessages.push({
                message: "invalid number of min Age restriction",
                field: "minAgeRestriction"
            });
        }
        if (!publicationDate || isNaN(+new Date(publicationDate))) {
            errors.errorsMessages.push({
                message: "Invalid date",
                field: "publicationDate"
            });
        }
        else {
            publicationDate = new Date().toISOString();
        }
        if (errors.errorsMessages.length) {
            res.status(400).send(errors);
            return;
        }
        videoDb[modifyVideoIndex] = Object.assign(Object.assign({}, videoDb[modifyVideoIndex]), { title,
            author,
            availableResolutions,
            canBeDownloaded,
            minAgeRestriction,
            publicationDate });
        res.sendStatus(204);
    }
});
//2879031

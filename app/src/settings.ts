import express, { Request, Response } from "express";


export const app = express()
app.use(express.json())

type requestWithParams<P> = Request<P, {}, {}, {}, {}>
type requestWithBody<B> = Request<{}, {}, B, {}>
type requestWithParamsAndBody<P, B> = Request<P, {}, B, {}>

type ErrorsType = {
  errorsMessages: errorMessagesType[]
}
type errorMessagesType = {
  field: string,
  message: string
}
enum AvailableResolutions {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160"
}
type videoType = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  createdAt: string,
  publicationDate: string,
  availableResolutions: AvailableResolutions[]
}

const videoDb: videoType[] = [
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
]
app.delete("/testing/all-data", (req:Request, res:Response) => {
    videoDb.length = 0
    res.sendStatus(204)
})
app.get("/videos", (req: Request, res: Response) => {
  res.send(videoDb)
})

app.get("/videos/:id", (req: requestWithParams<{ id: number }>, res: Response) => {

  const id = +req.params.id
  const video = videoDb.find(el => el.id === id)
  if (!video) {
    res.sendStatus(404)
    return
  } else {
    res.status(200).send(video)
  }
})
app.post("/videos", (req: requestWithBody<{ title: string, author: string, availableResolutions: AvailableResolutions[] }>, res: Response) => {
  let errors: ErrorsType = {
    errorsMessages: []
  }
  let { title, author, availableResolutions } = req.body
  if (!title || !title.length || title.trim().length > 40) {
    errors.errorsMessages.push({ message: "invalid title", field: "title" })
  }
  if (!author || !author.length || author.trim().length > 20) {
    errors.errorsMessages.push({ message: "invalid author", field: "author" })
  }
  if (Array.isArray(availableResolutions) && availableResolutions.length) {
    availableResolutions.map(el =>
      !AvailableResolutions[el] && errors.errorsMessages.push({
        message: "invalid availbale resolutions",
        field: "availableResolutions"
      })
    )
  } else {
    availableResolutions = []
  }

  if (errors.errorsMessages.length) {
    res.status(400).send(errors)
    return
  } else {
    const createdAtDate = new Date()
    const publicationDate = new Date()
    publicationDate.setDate(createdAtDate.getDate() + 1)
    const newVideo: videoType = {
      id: +new Date(),
      title,
      author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAtDate.toISOString(),
      publicationDate: publicationDate.toISOString(),
      availableResolutions

    }
    videoDb.push(newVideo)
    res.status(201).send(newVideo)
  }
})

app.delete("/videos/:id", (req: requestWithParams<{ id: number }>, res: Response) => {
  const id = +req.params.id
  const videoIndex = videoDb.findIndex(el => el.id === id)
  if (videoIndex < 0) {
    res.sendStatus(404)
    return
  } else {
    videoDb.splice(videoIndex, 1)
    res.sendStatus(204)
  }
})
app.put("/videos/:id", (req: requestWithParamsAndBody<{ id: number }, {
  title: string,
  author: string,
  availableResolutions: AvailableResolutions[],
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  publicationDate: string,
}>, res: Response) => {
  const id = +req.params.id
  const errors: ErrorsType = {
    errorsMessages: []
  }
  let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body
  const modifyVideoIndex = videoDb.findIndex(el => el.id === id)
  if (modifyVideoIndex < 0) {
    res.sendStatus(404)
    return
  } else {
    if (!title || title.trim().length > 40 || !title.length) {
      errors.errorsMessages.push({ message: "invalid title", field: "title" })
    }
    if (!author || author.trim().length > 40 || !author.length) {
      errors.errorsMessages.push({ message: "invalid author", field: "author" })
    }
    if (Array.isArray(availableResolutions) && availableResolutions.length) {
      availableResolutions.map(el =>
        !AvailableResolutions[el] && errors.errorsMessages.push({
          message: "invalid availbale resolutions",
          field: "availableResolutions"
        })
      )
    } else {
      availableResolutions = []
    }
    if (canBeDownloaded && typeof (canBeDownloaded) !== "boolean") {
      errors.errorsMessages.push({
        message: "bad type of canBeDownLoaded, type of canBeDownLoaded must be boolean",
        field: "canBeDownloaded"
      })
    } else {
      canBeDownloaded = false
    }
    if (!minAgeRestriction || minAgeRestriction < 0 || minAgeRestriction > 18 || typeof (minAgeRestriction) !== "number") {
      errors.errorsMessages.push({
        message: "invalid number of min Age restriction",
        field: "minAgeRestriction"
      })
    } 
    if(!publicationDate || isNaN(+new Date(publicationDate)) ){
        errors.errorsMessages.push({
          message: "Invalid date",
          field: "publicationDate"
        })
    } else {
      publicationDate = new Date().toISOString()
    }
    
    if(errors.errorsMessages.length){
      res.status(400).send(errors)
      return
    }
    videoDb[modifyVideoIndex] = {
      ...videoDb[modifyVideoIndex],
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,

    }
    res.sendStatus(204)
  }
})

//2879031
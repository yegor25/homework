import { app } from "./settings"
import { Request,Response } from "express"
 
 

 const port = 3000


 
 app.delete("/__tests__/data",(req:Request, res:Response) => {
   res.sendStatus(204)
 })

 app.listen(port, () => {
    console.log(`server runnung... on ${port} port`)
 })




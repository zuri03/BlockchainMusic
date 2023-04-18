import express from 'express'

const app : express.Application = express()

app.get('/', function (req : express.Request, res : express.Response) : void {
    res.send("SUCCESS!!!")
})  

app.listen(8000);
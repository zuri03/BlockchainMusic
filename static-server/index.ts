import express from 'express'
import path from 'path'

const PORT = 8000;
const app : express.Application = express()

/*
app.get('/', function (req : express.Request, res : express.Response) : void {
    console.log(process.cwd())
    console.log(path.join(process.cwd(), 'public'))
    res.send("SUCCESS!!!")
}); 
*/

//app.use(express.static('public'));
app.use(express.static(path.join(process.cwd(), 'public')))

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
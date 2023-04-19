import express from 'express'
import path from 'path'

const PORT = 8000;
const app : express.Application = express()

app.use(express.static(path.join(process.cwd(), 'public')))

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
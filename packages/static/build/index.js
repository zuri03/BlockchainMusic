import express from 'express';
const app = express();
app.get('/', function (req, res) {
    res.send("SUCCESS!!!");
});
app.listen(8000);

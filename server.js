const express = require("express")

const app = express()

// app.use((req, res, next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     next()
// })

app.use(express.static("."))

app.listen(60024)
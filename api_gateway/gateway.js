const express = require('express')
const app = express()
const PORT = 9090

app.use(express.json())

app.listen(PORT, ()=>{
  console.log('Gateway is started on port ' + PORT)
})

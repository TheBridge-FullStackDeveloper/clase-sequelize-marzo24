const express = require("express")
const { typeError } = require("./middleware/errors")
const app = express()
const PORT= 3001

app.use(express.json())

app.use("/users",require("./routes/users"))
app.use("/posts",require("./routes/posts"))

app.use(typeError)

app.listen(PORT,()=> console.log(`Server started on port ${PORT}`))
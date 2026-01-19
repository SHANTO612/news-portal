const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const body_parser = require('body-parser')
const db_connect = require('./utils/db')

dotenv.config()

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true })) // Add this for form data

// Middleware to ensure DB connection on every request (for Serverless)
app.use(async (req, res, next) => {
    await db_connect();
    next();
});

if (process.env.mode === 'production' || process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: [
            "http://localhost:5173", 
            "http://localhost:3000",
            process.env.CLIENT_URL,
            process.env.FRONTEND_URL
        ].filter(Boolean) // Filter out undefined/null values
    }))
} else {
    app.use(cors({
        origin: ["http://localhost:5173" , "http://localhost:3000"]
    }))
}




const port = process.env.PORT || 5000

app.use('/',require('./routes/authRoutes'))
app.use('/',require('./routes/newsRoutes'))
app.get('/', (req,res) => res.send("Hello Easy"))

if (require.main === module) {
    db_connect()
    app.listen(port,() => console.log(`Server is running on port ${port}`))
}

module.exports = app
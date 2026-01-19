const mongoose = require('mongoose')
const db_connect = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        
        if (process.env.mode === 'production' || process.env.NODE_ENV === 'production') {
            if (!process.env.db_production_url) {
                console.error('Error: db_production_url environment variable is missing in production mode.');
                throw new Error('db_production_url missing');
            }
            await mongoose.connect(process.env.db_production_url, {
                serverSelectionTimeoutMS: 5000 // Fail fast if DB is unreachable
            })
            console.log('Production database connect')
        } else {
            await mongoose.connect(process.env.DB_LOCAL_URL)
            console.log('Local database connect')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = db_connect 
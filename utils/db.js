const mongoose = require('mongoose')
const db_connect = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        
        if (process.env.mode === 'production' || process.env.NODE_ENV === 'production') {
            await mongoose.connect(process.env.db_production_url)
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
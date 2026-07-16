const Datastore = require('nedb-promises');
const path = require('path');

// Creates a pure local data file inside your Project Soil folder automatically
const db = Datastore.create({
    filename: path.join(__dirname, 'soil_database.db'),
    autoload: true
});

async function connectDB() {
    console.log("📂 Local Pure-JS Database cleanly synchronized!");
}

module.exports = { connectDB, db };

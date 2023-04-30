const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const mongoURI = 'mongodb://localhost:27017/hackathonDB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
const connectToMongo = () => { mongoose.connect(mongoURI, ()=> { console.log("Connection Established") }) }
module.exports = connectToMongo
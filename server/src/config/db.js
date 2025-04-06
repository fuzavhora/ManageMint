const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error(`MongoDb error : ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
// This code connects to a MongoDB database using Mongoose. It exports a function that attempts to connect to the database using the URI stored in an environment variable. If the connection is successful, it logs a success message; if it fails, it logs the error and exits the process with a failure code.
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;


async function connectToDatabase() {
    //// Configure MongoDB connection 
    // mongoose.connect('mongodb://localhost/user_management', { useNewUrlParser: true, useUnifiedTopology: true })
    //   .then(() => console.log('Connected to MongoDB'))
    //   .catch(err => console.error('Failed to connect to MongoDB', err));
    // 
    if (process.env.ME_CONFIG_MONGODB_URL) {
        await mongoose.connect(process.env.ME_CONFIG_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Connected to MongoDB');
    } else {
        const mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to in-memory MongoDB');
    }
    // const mongo = await MongoMemoryServer.create();
    // const uri = mongo.getUri();
    // await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // await mongoose.connect(process.env.ME_CONFIG_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
}


async function closeDatabase() {
    await mongoose.disconnect();

    await mongoServer.stop();
    console.log('Disconnected from in-memory MongoDB');
}

module.exports = {
    connectToDatabase,
    closeDatabase,
};
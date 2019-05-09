const mongodb = require('mongodb')

const url = 'mongodb://localhost:27017';

const dbName = 'userManagement';

const mongoClient = new mongodb.MongoClient(url, {
    useNewUrlParser: true
});

module.exports = class DataBase {
    async connect() {
        await mongoClient.connect().catch(err => {
            console.log(err);
        });
    }

    getDb(){
        return mongoClient.db(dbName);
    }

    close() {
        mongoClient.close();
        console.log('connection clossed');
    }
}
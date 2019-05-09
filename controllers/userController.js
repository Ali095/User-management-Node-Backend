const assert = require('assert');
const mongodb = require('mongodb');
const DataBase = require('../DataBase');
const User = require('../models/User');

const ObjectId = mongodb.ObjectId;

let db = new DataBase();
let coll;

module.exports = class UserControllers {
    async connection() {
        await db.connect().catch((err) => {
            if (err) {
                console.log('got error while connecting');
                throw err;
            }
        });
        coll = db.getDb().collection("user");
        console.log('connection made');
    }

    async addNew(obj) {
        let user = new User(obj.name || null, obj.age || null, obj.cnic || null, obj.dob|| null);
        await coll.insertOne(user, (err) => {
            assert.strictEqual(err, null);
        });
        console.log('added into db');
    }

    async deleteUser(id) {
        await coll.deleteOne({
            "_id": ObjectId(id)
        }, (err, result) => {
            assert.strictEqual(err, null, 'An error occured while finding the object');
            assert.strictEqual(1, result.result.n, `not one but ${result.result.n} record deleted`);
        });
        console.log('deleted succesfully');
    }

    async getAll() {
        let data = await coll.find({}).toArray().catch(err => {
            console.log(`\n\n\n\terror=>${err}\n\n`);
        });
        return data
    }

    async getOne(userid) {
        const singaluser = await coll.findOne({
            _id: ObjectId(userid)
        });
        // console.log(JSON.stringify(singaluser));
        return singaluser || null;
    }

    async updateUser(obj) {
        await coll.updateOne({
            _id: ObjectId(obj._id)
        }, {
            $set: {
                name: obj.name,
                dob: obj.dob,
                cnic:obj.cnic,
                age:obj.age
            }
        }, (err, result) => {
            if (err) throw err;
            else
                console.log('updated succesfully');
        });
    }
}
var express = require('express');
const bodyParser = require('body-parser');
const nodeFetch = require('node-fetch');
const userController = require('../controllers/userController');

// create application/json parser
var jsonParser = bodyParser.json()

let user = new userController();

var router = express.Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET Users listing. */
router.get('/users', async (req, res) => {
  res.json(await user.getAll());
  console.log('Get all succesfully');
});

/* Get a single User */
router.get('/user', async (req, res) => {
  const singalUser = await user.getOne(req.query.id);
  if (!singalUser)
    res.status(404).json(`The User with ${ req.query.id } is not found`);
  res.json(singalUser);
});

/* Post User */
router.post('/addNewUser', jsonParser, async (req, res) => {
  if (!req.body)
    return res.status(400);
  await user.addNew(req.body);
  console.log(`\n\nadded successfully\n\n\tbody=> ${JSON.stringify(req.body)}`);
});

/* Update a single User */
router.put('/updateUser', jsonParser, async (req, res) => {
  if (!req.body)
    return res.status(400);
  await user.updateUser(req.body);
  res.json('updated succesfully');
});

/* Delete a singal user */
router.delete('/deleteUser', async (req, res) => {
  user.deleteUser(req.query.id);
  res.json(`user is deleted successfully`);
  console.log('deleted succesfully');
});

router.post('/fb-login', jsonParser, async (req, res) => {
  console.log('in post of fb lognin')
  console.log('BODY=>>>' + req.body);
  const {
    accessToken,
    userID,
    userObj
  } = req.body;
  const fbres = await nodeFetch(`https://graph.facebook.com/v3.3/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`);
  fbResJson = await fbres.json();
  console.log(fbResJson);
  if (fbResJson.id === userID) {
    //a valid user
    user.addNew(userObj);
    res.json('valid user and done adding');
  } else {
    //some bad user
    res.json('in valid user access token');
  }
});

module.exports = router;
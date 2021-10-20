const  {isAdmin} = require ("../controllers/auth");

const express = require('express');
const router = express.Router();

const {create, articleById, read, remove, update} = require('../controllers/article');
const {requireSignin, isAuth} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/article/:articleId', read);
router.post('/article/create/:userId', requireSignin, isAuth, create);
router.delete('/article/:articleId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/article/:articleId/:userId', requireSignin, isAuth, update);

router.param('userId', userById);
router.param('articleId', articleById);


module.exports = router;
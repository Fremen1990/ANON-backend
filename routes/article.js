const {isAdmin} = require("../controllers/auth");

const express = require('express');
const router = express.Router();

const {
    create,
    articleById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo
} = require('../controllers/article');

const {
    requireSignin,
    isAuth
} = require('../controllers/auth');

const {userById} = require('../controllers/user');

router.get('/article/:articleId', read);
router.post('/article/create/:userId', requireSignin, isAuth, create);
router.delete('/article/:articleId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/article/:articleId/:userId', requireSignin, isAuth, update);

router.get('/articles', list);
router.get('/articles/related/:articleId', listRelated)
router.get('/articles/categories', listCategories)
router.post("/articles/by/search", listBySearch);
router.get('/article/photo/:articleId', photo);


router.param('userId', userById);
router.param('articleId', articleById);


module.exports = router;
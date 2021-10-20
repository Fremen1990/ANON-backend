const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Article = require('../models/article');
const {errorHandler} = require('../helpers/dbErrorhandler');

exports.articleById = (req, res, next, id) => {
    Article.findById(id).exec((err, article) => {
        if (err || !article) {
            return res.status(400).json({error: "Article not found"})
        }
        req.article = article;
        next();
    })
}

exports.read = (req, res) => {
    req.article.photo = undefined;
    console.log(req.article)
    return res.json(req.article);
}

exports.create = (req, res) => {

    let form = formidable({multiples: true});
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({error: "Image could not be uploaded"})
        }
        // check for mandatory fields
        const {name, paragraph1, category, author, articleDate} = fields;
        if (!name || !paragraph1 || !category || !author || !articleDate) {
            return res.status(400).json({
                error: "All fields required"
            })
        }
        let article = new Article(fields)
        // 1kb = 1024 b
        // 1mb = 1024 * 1000 = 1024000
        if (files.photo) {
            // console.log("FILES PHOTO", files.photo)

            if (files.photo.size > 1024 * 1000 * 3) // 3MB
            {
                return res.status(400).json({
                    error: "Photo should be less than 3  MB in size"
                })
            }


            article.photo.data = fs.readFileSync(files.photo.path)
            article.photo.contentType = files.photo.type
        }
        article.save((err, result) => {
            if (err) {
                return res.status(400).json({error: errorHandler(err)})
            }
            res.json(result);
        })
    })
}

exports.remove = (req, res) => {
    let article = req.article;
    article.remove((err, deletedArticle) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            // deletedArticle,
            "message": "Article deleted successfully",
        })
    })
}


exports.update = (req, res) => {

    let form = formidable({multiples: true});
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({error: "Image could not be uploaded"})
        }
        // check for mandatory fields
        const {name, paragraph1, category, author, articleDate} = fields;
        if (!name || !paragraph1 || !category || !author || !articleDate) {
            return res.status(400).json({
                error: "All fields required"
            })
        }
        let article = req.article
        article = _.extend(article, fields)
        // 1kb = 1024 b
        // 1mb = 1024 * 1000 = 1024000
        if (files.photo) {
            // console.log("FILES PHOTO", files.photo)

            if (files.photo.size > 1024 * 1000 * 3) // 3MB
            {
                return res.status(400).json({
                    error: "Photo should be less than 3  MB in size"
                })
            }
            article.photo.data = fs.readFileSync(files.photo.path)
            article.photo.contentType = files.photo.type
        }
        article.save((err, result) => {
            if (err) {
                return res.status(400).json({error: errorHandler(err)})
            }
            res.json(result);
        })
    })
}
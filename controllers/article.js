const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Article = require("../models/article");
const { errorHandler } = require("../helpers/dbErrorhandler");

exports.articleById = (req, res, next, id) => {
  Article.findById(id).exec((err, article) => {
    if (err || !article) {
      return res.status(400).json({ error: "Article not found" });
    }
    req.article = article;
    next();
  });
};

exports.read = (req, res) => {
  req.article.photo = undefined;
  console.log(req.article);
  return res.json(req.article);
};

exports.create = (req, res) => {
  let form = formidable({ multiples: true });
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded" });
    }
    // check for mandatory fields
    const { name, paragraph1, category, author, articleDate } = fields;
    if (!name || !paragraph1 || !category || !author || !articleDate) {
      return res.status(400).json({
        error: "All fields required",
      });
    }
    let article = new Article(fields);
    // 1kb = 1024 b
    // 1mb = 1024 * 1000 = 1024000
    if (files.photo) {
      // console.log("FILES PHOTO", files.photo)

      if (files.photo.size > 1024 * 1000 * 3) {
        // 3MB
        return res.status(400).json({
          error: "Photo should be less than 3  MB in size",
        });
      }

      article.photo.data = fs.readFileSync(files.photo.path);
      article.photo.contentType = files.photo.type;
    }
    article.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let article = req.article;

  console.log("-------------++++++++++++++ \n");
  console.log(article);
  article.remove((err, deletedArticle) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      // deletedArticle,
      message: `${deletedArticle} - Article deleted successfully`,
    });
  });
};

exports.update = (req, res) => {
  let form = formidable({ multiples: true });
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded" });
    }
    // check for mandatory fields
    // const { name, paragraph1, category, author, articleDate } = fields;
    // if (!name || !paragraph1 || !category || !author || !articleDate) {
    //   return res.status(400).json({
    //     error: "All fields required",
    //   });
    // }

    let article = req.article;
    article = _.extend(article, fields);
    // 1kb = 1024 b
    // 1mb = 1024 * 1000 = 1024000
    if (files.photo) {
      // console.log("FILES PHOTO", files.photo)

      if (files.photo.size > 1024 * 1000 * 3) {
        // 3MB
        return res.status(400).json({
          error: "Photo should be less than 3  MB in size",
        });
      }
      article.photo.data = fs.readFileSync(files.photo.path);
      article.photo.contentType = files.photo.type;
    }
    article.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      }
      res.json(result);
    });
  });
};

// By Arrival / date of the article
//by arrival = /articles?sortBy=createdAt&order=desc&limit=3
// if no params are sent, then all articles returned
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Article.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, articles) => {
      if (err) {
        return res.status(400).json({
          error: "Articles not found",
        });
      }
      res.json(articles);
    });
};

//This will find the articles based on the request product category
// Other articles with the same category will be returned
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 3;

  Article.find({ _id: { $ne: req.article }, category: req.article.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, articles) => {
      if (err) {
        return res.status(400).json({
          error: "Articles not found",
        });
      }
      res.json(articles);
    });
};

exports.listCategories = (req, res) => {
  Article.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    res.json(categories);
  });
};

/**
 * list article by search
 * we will implement article search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the article to users based on what he wants
 */

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Article.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    // .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Articles not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.article.photo.data) {
    res.set("Content-Type", req.article.photo.contentType);
    return res.send(req.article.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  //create query object to hold search value and category value
  const query = {};
  //assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    //assigne category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    //find the product based on query object with 2 properties
    //search and category
    Article.find(query, (err, articles) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(articles);
    }).select("-photo");
  }
};

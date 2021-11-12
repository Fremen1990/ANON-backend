const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "You are not authorized to perform this action" });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

exports.listUsers = (req, res) => {
  User.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.photo = (req, res, next) => {
  if (req.user.photo.data) {
    res.set("Content-Type", req.user.photo.contentType);
    return res.send(req.user.photo.data);
  }
  next();
};

// exports.create = (req, res) => {
//   let form = formidable({ multiples: true });
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({ error: "Image could not be uploaded" });
//     }
//     // check for mandatory fields
//     const { name, email, hashed_password, role } = fields;
//     if (!name || !email || !hashed_password || !role) {
//       return res.status(400).json({
//         error: "All fields required",
//       });
//     }
//     let user = new User(fields);
//     // 1kb = 1024 b
//     // 1mb = 1024 * 1000 = 1024000
//     if (files.photo) {
//       // console.log("FILES PHOTO", files.photo)
//
//       if (files.photo.size > 1024 * 1000 * 3) {
//         // 3MB
//         return res.status(400).json({
//           error: "Photo should be less than 3  MB in size",
//         });
//       }
//
//       user.photo.data = fs.readFileSync(files.photo.path);
//       user.photo.contentType = files.photo.type;
//     }
//     user.save((err, result) => {
//       if (err) {
//         return res.status(400).json({ error: errorHandler(err) });
//       }
//       res.json(result);
//     });
//   });
// };
//
// exports.update = (req, res) => {
//   let form = formidable({ multiples: true });
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({ error: "Image could not be uploaded" });
//     }
//     // check for mandatory fields
//     const { name, email, hashed_password, role } = fields;
//     if (!name || !email || !hashed_password || !role) {
//       return res.status(400).json({
//         error: "All fields required",
//       });
//     }
//     let user = req.user;
//     user = _.extend(article, fields);
//     // 1kb = 1024 b
//     // 1mb = 1024 * 1000 = 1024000
//     if (files.photo) {
//       // console.log("FILES PHOTO", files.photo)
//
//       if (files.photo.size > 1024 * 1000 * 3) {
//         // 3MB
//         return res.status(400).json({
//           error: "Photo should be less than 3  MB in size",
//         });
//       }
//       user.photo.data = fs.readFileSync(files.photo.path);
//       user.photo.contentType = files.photo.type;
//     }
//     user.save((err, result) => {
//       if (err) {
//         return res.status(400).json({ error: errorHandler(err) });
//       }
//       res.json(result);
//     });
//   });
// };

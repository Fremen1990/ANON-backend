const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// Article Schema
const articleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
    },
    paragraph1: {
      type: String,
      trim: true,
      required: true,
      maxLength: 10000,
    },
    paragraph2: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph3: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph4: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph5: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph6: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph7: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph8: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph9: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    paragraph10: {
      type: String,
      trim: true,
      maxLength: 10000,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    author: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
    },
    articleDate: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    // photoDesktop: {
    //     data: Buffer,
    //     contentType: String
    // },
    // photoMobile: {
    //     data: Buffer,
    //     contentType: String
    // },
    approved: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);

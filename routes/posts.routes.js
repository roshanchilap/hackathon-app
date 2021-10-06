const route = require("express").Router();

const service = require("../services/posts.service");

const { ObjectId } = require("bson");
const { ReturnDocument } = require("mongodb");
const db = require("../shared/mongo");

//Posts routes
route.get("/", service.find);
route.post("/", service.insert);
route.put("/:id", service.update);
route.delete("/:id", service.delete);

module.exports = route;

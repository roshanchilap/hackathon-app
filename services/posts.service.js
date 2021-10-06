const { ObjectId } = require("bson");

const db = require("../shared/mongo");

const { postSchema } = require("../shared/schema");

const service = {
  async find(req, res) {
    {
      try {
        console.log(req.user);
        const data = await db.posts.find({ userId: req.user.userId }).toArray();
        res.send(data);
      } catch (err) {
        res.sendStatus(500);
      }
    }
  },
  async insert(req, res) {
    try {
      let { error, value } = await postSchema.validate(req.body);

      if (error)
        return res.status(400).send({
          erorr: "",
          message: error.details[0].message,
        });
      const { insertedId: _id } = await db.posts.insertOne({
        ...value,
        userId: req.user.userId,
      });
      res.send({ ...value, _id });
    } catch (err) {
      res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      let { error, value } = await postSchema.validate(req.body);

      if (error)
        return res.status(400).send({
          erorr: "",
          message: error.details[0].message,
        });

      const post = await db.posts.findOne({
        _id: ObjectId(req.params.id),
        userId: req.user.userId,
      });
      if (!post)
        return res
          .status(401)
          .send({ error: "You don't have access to this post" });
      const data = await db.posts.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: { ...value } },
        { returnDocument: "after" }
      );
      res.send(data);
    } catch (err) {
      res.status(400).send({ message: "Error updating data" });
    }
  },
  async delete(req, res) {
    const post = await db.posts.findOne({
      _id: ObjectId(req.params.id),
      userId: req.user.userId,
    });
    if (!post)
      return res
        .status(401)
        .send({ error: "You don't have access to this post" });
    console.log(req.params);
    await db.posts.remove({ _id: ObjectId(req.params.id) });
    res.end();
  },
};

module.exports = service;

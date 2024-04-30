const { Post, User, Sequelize } = require("../models/index");
const { Op } = Sequelize;

const PostController = {
  async create(req, res) {
    try {
      req.body.UserId = req.user.id //el UserId va a ser el del usuario logueadeo
      const post = await Post.create(req.body);
      res.status(201).send({ msg: "Publicación creada exitosamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async getAll(req, res) {
    try {
      const posts = await Post.findAll({
        include: [{ model: User, attributes: ["name", "email"] }],
      });
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async getById(req, res) {
    try {
      const post = await Post.findByPk(req.params.id, {
        include: [{ model: User, attributes: ["name", "email"] }],
      });
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getByTitle(req, res) {
    try {
      const post = await Post.findAll({
        where: {
          title: {
            [Op.like]: `%${req.params.title}%`,
          },
        },
      });
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async delete(req, res) {
    try {
      await Post.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.send("La publicación ha sido eliminada con éxito");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
};

module.exports = PostController;

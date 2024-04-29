const { User, Post } = require("../models/index");

const UserController = {
  async create(req, res) {
    try {
      req.body.role = "user";
      const user = await User.create(req.body);
      res.status(201).send({ msg: "Usuario creado con éxito", user });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async getAll(req, res) {
    try {
      const users = await User.findAll({
        include: [{ model: Post, attributes: ["title"] }],
      });
      res.send({ msg: "Todos los usuarios", users });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async delete(req, res) {
    try {
      await User.destroy({
        where: {
          id: req.params.id,
        },
      });
      await Post.destroy({
        where: {
          UserId: req.params.id,
        },
      });
      res.send("El usuario ha sido eliminado con éxito");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async update(req, res) {
    try {
      await User.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      res.send("Usuario actualizado con éxito");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
};

module.exports = UserController;

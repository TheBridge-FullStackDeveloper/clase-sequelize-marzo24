const { User, Post, Token, Sequelize } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const { jwt_secret } = require("../config/config.json")["development"];
const { Op } = Sequelize;

const UserController = {
  async create(req, res, next) {
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      // req.body.role = "user";
      // req.body.password = password
      const user = await User.create({ ...req.body, password, role: "user",confirmed:false });
      const emailToken = jwt.sign({email:req.body.email},jwt_secret,{expiresIn:'48h'})
      const url =`http://localhost:3001/users/confirm/${emailToken}`
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3> Bienvenido, estás a un paso de registrarte </h3>
        <a href="${url}"> Clica para confirmar tu registro</a>
        `,
      });

      res.status(201).send({ msg: "Usuario creado con éxito", user });
    } catch (error) {
      console.error(error);
      next(error)
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
  // getAll(req, res) {
  //   User.findAll({
  //     include: [{ model: Post, attributes: ["title"] }],
  //   })
  //     .then((users) => {
  //       res.send({ msg: "Todos los usuarios", users });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       res.status(500).send(error);
  //     });
  // },
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
  async login(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      // if(user.confirmed == false)
      if(!user.confirmed){
        return res.status(400).send({message:"Ye estas tonto confirma el correo nano!"})
      }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      const token = jwt.sign({ id: user.id }, jwt_secret);
      await Token.create({ UserId: user.id, token });
      res.send({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async logout(req, res) {
    try {
      await Token.destroy({
        where: {
          [Op.and]: [
            { UserId: req.user.id },
            { token: req.headers.authorization },
          ],
        },
      });
      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "hubo un problema al tratar de desconectarte" });
    }
  },
  async confirm(req,res){
    try {
      const token = req.params.emailToken
      const payload = jwt.verify(token,jwt_secret)
      
      await User.update({confirmed:true},{
        where:{
          email: payload.email
        }
      })
      res.status(201).send("Usuario confirmado con éxito");
    } catch (error) {
      console.error(error)
    }
  },

};

module.exports = UserController;

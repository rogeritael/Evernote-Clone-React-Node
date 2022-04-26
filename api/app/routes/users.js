var express = require('express');
var router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_TOKEN;

router.post('/register', async(req, res) => {
  //pega os campos name, email e password do formulário/ cria um novo usuário com essas informações
  const {name, email, password } = req.body;
  const user = new User({name, email, password})
  try{
    //tenta salvar no banco de dados
    await user.save();
    res.status(200).json(user);
  }catch(error){
    res.status(500).json({error: 'Error registering new user'});
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      let user = await User.findOne({email});
      if(!user){
          res.status(401).json({ error: "incorrect email or password" });
      }else{
          user.isCorrectPassword(password, function(error, same){
              if(!same){
                  res.status(401).json({ error: "incorrect email or password" });
              }else{
                  const token = jwt.sign({email}, secret, {expiresIn: '10d'});
                  res.json({user: user, token: token});
              }
          })
      }
  } catch (error) {
      res.status(500).json({error: `Internal error, please try again. Error: ${error}`});
  }
})

module.exports = router;

//req.body é tudo que é enviado manualmente pelo usuário e que não vai para a url, como form
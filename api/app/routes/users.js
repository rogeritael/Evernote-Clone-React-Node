var express = require('express');
var router = express.Router();
const User = require('../models/user');

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
})

module.exports = router;

//req.body é tudo que é enviado manualmente pelo usuário e que não vai para a url, como form
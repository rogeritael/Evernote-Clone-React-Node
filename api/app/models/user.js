const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    created_at: { type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now}
});

//roda script antes de fazer a operação 'save' no banco de dados
userSchema.pre('save', function (next) {
    //verifica se a senha é nova ou está sendo modificada, para não criptografar sem nescessidade
    if(this.isNew || this.isModified('password')){
        //numero de caracteres aleatorios que serão gerados
        bcrypt.hash(this.password, 10,
            //devolve erro ou o password criptografado
            (error, hashedPassword) => {
                if(error){
                    next(error)
                }else{
                    //insere o password criptografado na senha
                    this.password = hashedPassword;
                    next();
                }
        })
    }
});

//método de usuário verificar senha
userSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(error, same) {
        if(error){
            callback(error);
        }else{
            callback(error, same);
        }
    });
};

module.exports = mongoose.model('User', userSchema);
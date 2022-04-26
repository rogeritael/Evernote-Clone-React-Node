const mongoose = require('mongoose');

let noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    created_at: { type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true}
});

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

module.exports = mongoose.model('Note', noteSchema);
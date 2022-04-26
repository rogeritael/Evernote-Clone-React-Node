const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/javascriptNote', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('connection successful'))
.catch((error) => console.log(`connection error: ${error}`));
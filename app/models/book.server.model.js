var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  codigo:{
    type: String
  },
  titulo:{
    type: String
  },
  descripcion: {
    type: String
  },
  autor:{
    type: String
  },
  rama:{
    type: String
  }

});

mongoose.model('Book', BookSchema);

const mongoose = require('mongoose');

const MedidaSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  mediaTemp: Number,
  medianaTemp: Number,
  modaTemp: Number,
  desvioPTemp: Number,
  coeficienteVTemp: Number,
  assimetriaTemp: Number,
  curtoseTemp: Number,
  mediaUmid: Number,
  medianaUmid: Number,
  modaUmid: Number,
  desvioPUmid: Number,
  coeficienteVUmid: Number,
  assimetriaUmid: Number,
  curtoseUmid: Number,
  temperaturas: [Number],
  umidades: [Number],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Medida', MedidaSchema);

const mongoose = require('mongoose');

// Daily report schema
const dailyReportSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  numberofLabours: { type: Number },  
  workHours: { type: Number },
  rate: { type: Number },
  description: { type: String, required: true },
  dailyCharge: { type: Number, required: true }
});

// Receipt schema
const receiptSchema = new mongoose.Schema({
  labourName: { type: String, required: true },
  numberofLabours: { type: Number, required: true },
  totalPay: { type: Number, required: true },
  date: { type: Date, required: true },
  due: { type: Number, required: true }
});

// Labour schema
const labourSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dailyReports: [dailyReportSchema], // Embedding dailyReportSchema array
  receipts: [receiptSchema] // Embedding receiptSchema array
});

const Labour = mongoose.model('Labour', labourSchema);
module.exports = Labour;

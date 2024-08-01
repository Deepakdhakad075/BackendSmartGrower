// receiptModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReceiptSchema = new Schema({
  labourId: { type: Schema.Types.ObjectId, ref: 'Labour' },
  totalCharges: Number,
  amountPaid: Number,
  remainingAmount: Number,
  date: Date
});

module.exports = mongoose.model('Receipt', ReceiptSchema);

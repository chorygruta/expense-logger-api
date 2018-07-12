const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    _category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
});

module.exports = mongoose.model('Expense', expenseSchema);
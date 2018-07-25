const Expense = require('../models/expenses');
const User = require('../models/users');
const mongoose = require('mongoose');

exports.get_all_user_expenses = async (req, res, next) => {
    const userId = res.locals.userData.userId;

    const expenses = await Expense.find({
        _user: userId
    })
    .populate('_category')
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));

    res.status(200).json({
        success: true,
        data: {
            total_number_of_expenses: expenses.length,
            expenses: expenses
        }
    });
}

exports.create_new_expense = async (req, res, next) => {
    const userId = res.locals.userData.userId;

    const expenseObj = new Expense({
        _user: userId, 
        amount: req.body.amount,
        description: req.body.description,
        date: new Date(req.body.date),
        _category: req.body._category
    });

    const savedExpense = await expenseObj.save()
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));

    res.status(201).json({
        success: true,
        data: {
            createdExpense: savedExpense
        },
        message: 'Expense has been successfully created.'
    }); 
}
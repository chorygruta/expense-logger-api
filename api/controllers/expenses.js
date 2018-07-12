const Expense = require('../models/expenses');
const User = require('../models/users');
const mongoose = require('mongoose');

exports.get_all_user_expenses = (req, res, next) => {
    const userId = res.locals.userData.userId;

    Expense.find({
        _user: userId
    })
    .populate('_category')
    .exec()
    .then(expenses => {
        res.status(200).json({
            success: true,
            data: {
                total_number_of_expenses: expenses.length,
                expenses: expenses
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err
        });
    });
}

exports.create_new_expense = (req, res, next) => {
    const userId = res.locals.userData.userId;

    User.findById(userId)
    .exec()
    .then(user => {
        const expense = new Expense({
            _user: userId, 
            amount: req.body.amount,
            description: req.body.description,
            date: new Date(req.body.date),
            _category: req.body._category
        });
        expense.save()
        .then(result => {
            res.status(201).json({
                success: true,
                data: {
                    createdExpense: result
                },
                message: 'Expense has been successfully created.'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err
        });
    });  
}
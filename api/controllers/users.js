const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.get_all_users = (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            res.status(200).json({
                total_users: users.length,
                users: users
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_user = (req, res, next) => {
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user: user
                });
            } else {
                res.status(404).json({
                    message: 'The entered userId is incorrect'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.signup_user = (req, res, next) => {
    const filter = {
        email: req.body.email
    };

    User.find(filter)
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    success:false,
                    error: 'An account already exist with this email address, please enter a different email address'
                });

            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then(result => {
                                console.log(result);
                                next();
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    success: false,
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                error: err
            });
        });
}

exports.login_user = (req, res, next) => {
    const filter = {
        email: req.body.email
    };
    User.findOne(filter)
        .exec()
        .then(user => {
            if (!user) {
                console.log(user);
                return res.status(401).json({
                    success: false,
                    error: 'Auth failed length'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        error: 'Auth Failed by'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "8h"
                        }
                    );
                    User.findByIdAndUpdate(user._id, {
                            $push: {
                                loginHistory: Date()
                            }
                        })
                        .exec()
                        .then(doc => {
                            console.log('updated login history');
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                error: err
                            });
                        });

                    return res.status(200).json({
                        success: true,
                        data: {
                            token: token,
                            user: user
                        },
                        message: 'Auth succesful',
                    });
                }
                res.status(401).json({
                    success: false,
                    error: 'Auth failed'
                });
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

exports.delete_user = (req, res, next) => {
    if (req.params.userId === res.locals.userData.userId) {
        res.status(500).json({
            success: false,
            error: 'You have unsuccessfully deleted the entered user. A user is not allowed to delete its own account.'
        });
    } else {
        User.find({
                _id: req.params.userId
            })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    User.findByIdAndRemove({
                            _id: req.params.userId
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                success: false,
                                error: 'User has been successfully deleted.'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                error: err
                            });
                        });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'User does not exist.'
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    }
}
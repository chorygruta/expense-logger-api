const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.get_all_users = async (req, res, next) => {
    const users = await User.find()
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));

    res.status(200).json({
        total_users: users.length,
        users: users
    })
}

exports.get_user = async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));

    if (user) {
        res.status(200).json({
            user: user
        });
    } else {
        res.status(404).json({
            message: 'The entered userId is incorrect'
        });
    }
}

exports.signup_user = async (req, res, next) => {
    const filter = {
        email: req.body.email
    };

    const user = await User.find(filter)
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));

    if (user.length >= 1) {
        return res.status(409).json({
            success:false,
            error: 'An account already exist with this email address, please enter a different email address'
        });

    } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            } else {
                const userObj = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });

                const savedUser = await userObj.save()
                .catch(err => res.status(500).json({
                    success: false,
                    error: err
                }));
                
                next();
            }
        });
    }
}

exports.login_user = async (req, res, next) => {
    const filter = {
        email: req.body.email
    };

    const user = await User.findOne(filter)
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));

    if (!user) {
        console.log(user);
        return res.status(401).json({
            success: false,
            error: 'Auth failed'
        });
    }

    bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (err) {
            return res.status(401).json({
                success: false,
                error: 'Auth Failed'
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

            const updatedUser = await User.findByIdAndUpdate(user._id, {
                $push: {
                    loginHistory: Date()
                }
            })
            .catch(err => res.status(500).json({
                success: false,
                error: err
            }));

            return res.status(200).json({
                success: true,
                data: {
                    token: token,
                    user: {
                        id: updatedUser._id,
                        email: updatedUser.email,
                        loginHistory: updatedUser.loginHistory
                    }
                },
                message: 'Auth succesful',
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Auth failed'
            });
        }
    });
}

exports.delete_user = async (req, res, next) => {
    if (req.params.userId === res.locals.userData.userId) {
        res.status(500).json({
            success: false,
            error: 'You have unsuccessfully deleted the entered user. A user is not allowed to delete its own account.'
        });
    } else {
        const user = await  User.find({
            _id: req.params.userId
        })
        .catch(err => res.status(500).json({
            success: false,
            error: err
        }));

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
    }
}
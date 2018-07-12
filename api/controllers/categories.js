const Category = require('../models/categories');

exports.get_all_categories = (req, res, next) => {
    Category.find()
    .exec()
    .then(categories => {
        res.status(200).json({
            success: true,
            data: {
                total_categories: categories.length,
                categories: categories
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

exports.create_new_category = (req, res, next) => {
    Category.findOne({
        name: req.body.name
    })
    .then(category => {
        if(category) {
            return res.status(409).json({
                success: false,
                error: 'Entered category name already exist.'
            });
        } else {
            const category = new Category({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name
            });
            category.save()
            .then(result => {
                res.status(201).json({
                    success: true,
                    data: {
                        createdCategory: {
                            name: result.name
                        }
                    },
                    message: 'Category has been successfully created.'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
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
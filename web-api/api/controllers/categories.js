const Category = require('../models/categories');

exports.get_all_categories = async (req, res, next) => {
    const categories = await Category.find()
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));
    
    res.status(200).json({
        success: true,
        data: {
            total_categories: categories.length,
            categories: categories
        }
    });
}

exports.create_new_category = async (req, res, next) => {
    const category = await Category.findOne({ name: req.body.name })
    .catch(err => res.status(500).json({
        success: false,
        error: err
    }));

    if(category) {
        return res.status(409).json({
            success: false,
            error: 'Entered category name already exist.'
        });
    } else {
        const categoryObj = new Category({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name
        });

        const savedCategory = await categoryObj.save()
        .catch(err => res.status(500).json({
            success: false,
            error: err
        }));

        res.status(201).json({
            success: true,
            data: {
                createdCategory: {
                    name: savedCategory.name
                }
            },
            message: 'Category has been successfully created.'
        });
    }    

}
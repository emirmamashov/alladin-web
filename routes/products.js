let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

// services
let categoryService = require('../services/category');
let chunkService = require('../services/chunk');
let productService = require('../services/product');

module.exports = (app, db) => {
    let config = app.get('config');
    router.get('/', (req, res) => {
        db.Category.find().then(
            (categories) => {
                let categoryIds = [];
                let photoIds = [];
    
                if (categories && categories.length > 0) {
                    categories.forEach((category) => {
                        if (category) {
                          category['apiUrl'] = config.API_URL;
                          categoryIds.push(category._id);
                        }
                      });
                }
    
                db.Product.find().then(
                    (products) => {
                        let parentCategories = categoryService.findParentCategory(categories, products);
                        res.render('products/index', {
                            title: 'Products',
                            products: products,
                            parentCategories: parentCategories
                        });
                    }
                ).catch(
                    (err) => {
                        console.log(err);
                        res.render('products/index', {
                            title: 'Products',
                            products: [],
                            errors: err
                        });
                    }
                );
            }
        ).catch(
            (err) => {
                console.log(err);
                res.render('products/index', {
                    title: 'Products',
                    products: [],
                    errors: err
                });
            }
        );
    });

    router.get('/category/:categoryName/:id', (req, res) => {
        let categoryId = req.params.id;
        if (!categoryId || !ObjectId.isValid(categoryId)) {
            return res.render('products/index', {
                title: 'Products',
                products: [],
                errors: 'параметр неправильно передано'
            });
        }

        db.Category.find().then(
            (categories) => {
                categories.forEach((category) => {
                  if (category) {
                    category['apiUrl'] = config.API_URL;
                    productService.getCountProductsByCategoryId(db, categories, category);
                  }
                });
                let categoryIds = [];
                let currentCategory = categories.filter(x => x.id == categoryId);
                if (currentCategory[0]) {
                    categoryIds.push(categoryId);
                    let childsCategories = categoryService.findChildCategories(categories, currentCategory, []);
                    if (childsCategories && childsCategories.length > 0) {
                        childsCategories.forEach((category) => {
                            categoryIds.push(category.id);
                        });
                    }
                }
    
                db.Product.find({ categoryId: {$in: categoryIds } }).then(
                    (products) => {
                        let parentCategories = categoryService.findParentCategory(categories, products);
                        products.forEach((product) => {
                            if (product) {
                                product['apiUrl'] = config.API_URL;
                            }
                          });
                        res.render('products/index', {
                            title: 'Products',
                            products: products,
                            parentCategories: parentCategories,
                            category: currentCategory[0]
                        });
                    }
                ).catch(
                    (err) => {
                        console.log(err);
                        res.render('products/index', {
                            title: 'Products',
                            products: [],
                            errors: err
                        });
                    }
                );
            }
        ).catch(
            (err) => {
                console.log(err);
                res.render('products/index', {
                    title: 'Products',
                    products: [],
                    errors: err,
                });
            }
        );
    });

    router.get('/details/:id', (req, res) => {
        let id = req.params.id;
        db.Category.find().then(
            (categories) => {
                let categoryIds = [];
                let photoIds = [];
    
                categories.forEach((category) => {
                  if (category) {
                    category['apiUrl'] = config.API_URL;
                    categoryIds.push(category._id);
                  }
                });

                db.Product.findById(req.params.id).then(
                    (product) => {
                        let parentCategories = categoryService.findParentCategory(categories, []);
                        product['apiUrl'] = config.API_URL;
                        let images = [];
                        if (product.images && product.images.length > 0) {
                            product.images.forEach((image) => {
                                images.push({
                                    apiUrl: config.API_URL,
                                    image: image
                                });
                            });
                        }
                        console.log(product);
                        res.render('products/details', { 
                            title: 'details', 
                            product: product,
                            parentCategories: parentCategories,
                            images: images
                        });
                    }
                ).catch(
                    (err) => {
                        res.render('products/details', {
                            title: 'Products',
                            products: [],
                            errors: err
                        });
                        // res.redirect('/products');
                    }
                );
            }
        ).catch(
            (err) => {
                console.log(err);
                res.render('products/details', {
                    title: 'Products',
                    products: [],
                    errors: err
                });

                //res.redirect('/products');
            }
        );
    });

    router.post('/search', (req, res) => {
        let regex = new RegExp(req.body.text, 'i');
        console.dir(req.body);
        db.Product.find({ name: regex }).then(
            (products) => {
                console.log(products);
                res.render('products/index', {
                    title: 'Products',
                    products: products
                });
            }
        ).catch(
            (err) => {
                console.log(err);
                res.render('products/index', {
                    title: 'Products',
                    products: [],
                    errors: err
                });
            }
        );
    });

    app.use('/products', router);
}
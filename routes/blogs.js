let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

let categoryService = require('../services/category');
let chunkService = require('../services/chunk');

module.exports = (app, db) => {
  let config = app.get('config');
  /* GET home page. */
  router.get('/', (req, res) => {
    db.Category.find().then(
      (categories) => {
        console.log(config.API_URL);
        db.Product.find().then(
          (products) => {
            let categoryIds = [];
            let photoIds = [];

            categories.forEach((category) => {
              if (category) {
                category['apiUrl'] = config.API_URL;
                categoryIds.push(category._id);
              }
            });

            let parentCategories = categoryService.findParentCategory(categories, products);
            console.log(parentCategories);

            db.Banner.find().then(
              (banners) => {
                banners.forEach((banner) => {
                    banner['apiUrl'] = config.API_URL;
                });

                db.Producer.find().then(
                  (producers) => {
                    producers.forEach((producer) => {
                      producer['apiUrl'] = config.API_URL;
                    });

                    let categoryIds = [];
                    let categoriesViewInLikesBlock = categories.filter(x => x.viewInLikeBlock) || [];
                    categoriesViewInLikesBlock.forEach((category) => {
                      categoryIds.push(category._id);
                    });
                    let limitCount = categoryIds.length * 30;
                    console.log(limitCount);
                    let n = db.Product.count({ categoryId: { $in: categoryIds } });
                    let r = Math.floor(Math.random() * n);
                    db.Product.find({ categoryId: { $in: categoryIds } }).limit(limitCount).skip(r).then(
                      (rndProducts) => {
                        console.log(rndProducts);
                        rndProducts.forEach((product) => {
                          product['apiUrl'] = config.API_URL;
                        });
                        categoriesViewInLikesBlock.forEach((category) => {
                          category['rndProducts'] = rndProducts.filter(x => x.categoryId && x.categoryId.toString() === category._id.toString());
                        });

                        let hotProducts = products.filter(x => x.isHot);
                        hotProducts.forEach((product) => {
                          product['apiUrl'] = config.API_URL;
                        });
                        let findBanners = banners.filter(x => x.isShowInMainPage);
                        leftBannerShowInMainPage = {};
                        rigthBannerShowInMainPage = {};
                        if (findBanners[0]) leftBannerShowInMainPage = findBanners[0];
                        if (findBanners[1]) rigthBannerShowInMainPage = findBanners[1];

                        db.Blog.find().then(
                            (blogs) => {
                                console.log(blogs);
                                res.render('blogs/index', { 
                                    title: 'Главная страница',
                                    parentCategories: parentCategories,
                                    products: products,
                                    categoriesViewInMenu: parentCategories.filter(x => x.viewInMenu),
                                    apiUrl: config.API_URL,
                                    banners: banners,
                                    leftBannerShowInMainPage: leftBannerShowInMainPage,
                                    rigthBannerShowInMainPage: rigthBannerShowInMainPage,
                                    producers: producers,
                                    categoriesViewInLikesBlock: categoriesViewInLikesBlock,
                                    rndProducts: rndProducts,
                                    chunkHotProducts: chunkService(hotProducts, 3),
                                    blogs: blogs
                                });
                            }
                        ).catch(
                            (err) => {
                                console.log(err);
                                res.render('blogs/index', { 
                                  title: 'Express123',
                                  parentCategories: categoryService.findParentCategory(categories),
                                  products: [],
                                  errors: err,
                                  apiUrl: config.API_URL
                                });
                            }
                        );
                      }
                    ).catch(
                      (err) => {
                        console.log(err);
                        res.render('blogs/index', { 
                          title: 'Express123',
                          parentCategories: categoryService.findParentCategory(categories),
                          products: [],
                          errors: err,
                          apiUrl: config.API_URL
                        });
                      }
                    );
                  } 
                ).catch(
                  (err) => {
                    console.log(err);
                    res.render('blogs/index', { 
                      title: 'Express123',
                      parentCategories: categoryService.findParentCategory(categories),
                      products: [],
                      errors: err,
                      apiUrl: config.API_URL
                    });
                  }
                );
              }
            ).catch(
              (err) => {
                console.log(err);
                res.render('blogs/index', { 
                  title: 'Express123',
                  parentCategories: categoryService.findParentCategory(categories),
                  products: [],
                  errors: err,
                  apiUrl: config.API_URL
                });
              }
            );
          }
        ).catch(
          (err) => {
            console.log(err);
            res.render('blogs/index', { 
              title: 'Express123',
              parentCategories: categoryService.findParentCategory(categories),
              products: [],
              errors: err,
              apiUrl: config.API_URL
            });
          }
        );
      }
    ).catch(
      (err) => {
        console.log(err);
        res.render('blogs/index', { 
          title: 'Express123',
          categories: [],
          errors: err,
          apiUrl: config.API_URL
        });
      }
    );
  });

  router.get('/:name/:id', (req, res) => {
    let id = req.params.id;
    if (!id || !ObjectId.isValid(id)) {
        return res.render('blogs/details', { 
            title: 'Express123',
            categories: [],
            errors: 'parameters is not valid',
            apiUrl: config.API_URL
          });
    }
    db.Category.find().then(
      (categories) => {
        console.log(config.API_URL);
        db.Product.find().then(
          (products) => {
            let categoryIds = [];
            let photoIds = [];

            categories.forEach((category) => {
              if (category) {
                category['apiUrl'] = config.API_URL;
                categoryIds.push(category._id);
              }
            });

            let parentCategories = categoryService.findParentCategory(categories, products);
            console.log(parentCategories);

            db.Banner.find().then(
              (banners) => {
                banners.forEach((banner) => {
                    banner['apiUrl'] = config.API_URL;
                });

                db.Producer.find().then(
                  (producers) => {
                    producers.forEach((producer) => {
                      producer['apiUrl'] = config.API_URL;
                    });

                    let categoryIds = [];
                    let categoriesViewInLikesBlock = categories.filter(x => x.viewInLikeBlock) || [];
                    categoriesViewInLikesBlock.forEach((category) => {
                      categoryIds.push(category._id);
                    });
                    let limitCount = categoryIds.length * 30;
                    console.log(limitCount);
                    let n = db.Product.count({ categoryId: { $in: categoryIds } });
                    let r = Math.floor(Math.random() * n);
                    db.Product.find({ categoryId: { $in: categoryIds } }).limit(limitCount).skip(r).then(
                      (rndProducts) => {
                        console.log(rndProducts);
                        rndProducts.forEach((product) => {
                          product['apiUrl'] = config.API_URL;
                        });
                        categoriesViewInLikesBlock.forEach((category) => {
                          category['rndProducts'] = rndProducts.filter(x => x.categoryId && x.categoryId.toString() === category._id.toString());
                        });

                        let hotProducts = products.filter(x => x.isHot);
                        hotProducts.forEach((product) => {
                          product['apiUrl'] = config.API_URL;
                        });
                        let findBanners = banners.filter(x => x.isShowInMainPage);
                        leftBannerShowInMainPage = {};
                        rigthBannerShowInMainPage = {};
                        if (findBanners[0]) leftBannerShowInMainPage = findBanners[0];
                        if (findBanners[1]) rigthBannerShowInMainPage = findBanners[1];

                        db.Blog.findById(id).then(
                            (blog) => {
                                console.log(blog);
                                res.render('blogs/details', { 
                                    title: 'Главная страница',
                                    parentCategories: parentCategories,
                                    products: products,
                                    categoriesViewInMenu: parentCategories.filter(x => x.viewInMenu),
                                    apiUrl: config.API_URL,
                                    banners: banners,
                                    leftBannerShowInMainPage: leftBannerShowInMainPage,
                                    rigthBannerShowInMainPage: rigthBannerShowInMainPage,
                                    producers: producers,
                                    categoriesViewInLikesBlock: categoriesViewInLikesBlock,
                                    rndProducts: rndProducts,
                                    chunkHotProducts: chunkService(hotProducts, 3),
                                    blog: blog
                                });
                            }
                        ).catch(
                            (err) => {
                                console.log(err);
                                res.render('blogs/details', { 
                                  title: 'Express123',
                                  parentCategories: categoryService.findParentCategory(categories),
                                  products: [],
                                  errors: err,
                                  apiUrl: config.API_URL
                                });
                            }
                        );
                      }
                    ).catch(
                      (err) => {
                        console.log(err);
                        res.render('blogs/details', { 
                          title: 'Express123',
                          parentCategories: categoryService.findParentCategory(categories),
                          products: [],
                          errors: err,
                          apiUrl: config.API_URL
                        });
                      }
                    );
                  } 
                ).catch(
                  (err) => {
                    console.log(err);
                    res.render('blogs/details', { 
                      title: 'Express123',
                      parentCategories: categoryService.findParentCategory(categories),
                      products: [],
                      errors: err,
                      apiUrl: config.API_URL
                    });
                  }
                );
              }
            ).catch(
              (err) => {
                console.log(err);
                res.render('blogs/details', { 
                  title: 'Express123',
                  parentCategories: categoryService.findParentCategory(categories),
                  products: [],
                  errors: err,
                  apiUrl: config.API_URL
                });
              }
            );
          }
        ).catch(
          (err) => {
            console.log(err);
            res.render('blogs/details', { 
              title: 'Express123',
              parentCategories: categoryService.findParentCategory(categories),
              products: [],
              errors: err,
              apiUrl: config.API_URL
            });
          }
        );
      }
    ).catch(
      (err) => {
        console.log(err);
        res.render('blogs/details', { 
          title: 'Express123',
          categories: [],
          errors: err,
          apiUrl: config.API_URL
        });
      }
    );
  });

  app.use('/blogs', router);
};
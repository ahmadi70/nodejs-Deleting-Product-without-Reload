const Product = require('../models/product');
const NewDb = require('../models/newdb');
const Order = require('../models/order');
const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find().countDocuments()
  .then(numberProducts => {
    totalItems = numberProducts;

    return Product.find()
    .skip( (page-1) * ITEMS_PER_PAGE )
    .limit(ITEMS_PER_PAGE)
  })
  .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
       currentPage: page, 
       nextPage: page+1, 
       previousPage: page -1, 
       lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE),  
       hasNextPage: ITEMS_PER_PAGE * page < totalItems,
       hasPreviousPage: page>1
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  //currentPage, nextPage, previousPage, lastPage,  hasNextPage,hasPreviousPage

  const page = +req.query.page || 1;;
  let totalItems;

  Product.find().countDocuments()
  .then(numberProducts => {
    totalItems = numberProducts;

    return Product.find()
    .skip( (page-1) * ITEMS_PER_PAGE )
    .limit(ITEMS_PER_PAGE)
  })
  .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
       currentPage: page, 
       nextPage: page+1, 
       previousPage: page -1, 
       lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE),  
       hasNextPage: ITEMS_PER_PAGE * page < totalItems,
       hasPreviousPage: page>1
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.getDeleteDemo = (req, res, next) => {
  NewDb.find()
  .then(products => {
    res.render('./DeleteDemo', {
      path: '/delte',
      pageTitle: 'DeleteDemo',
      products: products
    });
  })
  .catch(err => console.log(err))
      
};

exports.postDeleteDemo = (req, res, next)=>{
  const prodId = req.params.productId;
  console.log(prodId)
  NewDb.findByIdAndRemove(prodId)
  .then(() => {
      // console.log('DESTROYED PRODUCT');

      res.json({message: "Deleted!"});
    })
    .catch(err => res.json({message: "Not Deleted!"}));
}
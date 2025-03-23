import express from 'express';
import passport from 'passport';
import passportConfig from "../config/passport.js";
const router = express.Router();

import * as clientDB from '../2_Client/clientProductModule.js';
import session from 'express-session';

// router specs
router.use(function (req, res, next) {
  if (req.session.sessionData === undefined) {
    req.session.sessionData = {
      'lookupByMakeupId': [],
      'lookupByMakeupName': [],
      'lookupByBrandId': [],
      'lookupByBrandName': []
    };
  }
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

//Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

//Ensure user is authroized with a specific role
const ensureAuthorized = (requiredRole) => {
  return (req, res, next) => {
    if (req.isAuthenticated) {
      const user = req.user;
      if (user?.role === requiredRole) {
        return next();
      } else {
        res.render('error',
          {
            user: req.user,
            message: 'Insufficient access permissions'
          });
      }
    } else {
      res.redirect('/login');
    }
  }
}

//Admin route
router.get('/admin', ensureAuthorized('admin'), async (req, res) => {
  res.render('adminDash');
});

router.get('/admin/customers', ensureAuthorized('admin'), async (req, res) => {
  const customers = await clientDB.getAllCustomers();
  res.render('adminCustomers', { customers: customers.allCustomers });
});

router.get('/admin/products', ensureAuthorized('admin'), async (req, res) => {
  const makeup = await clientDB.allMakeup();
  res.render('adminMakeup', { makeup: makeup.allMakeup });
});

router.get('/admin/products/add', ensureAuthorized("admin"), (req, res) => {
  res.render('adminAddProduct');  
});

router.post('/admin/products/add', ensureAuthorized("admin"), async (req, res) => {
  const { name, category, price, quantity, brand, description } = req.body;
  const newProduct = {
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      brand, 
      description
  };

  await clientDB.addProduct(newProduct);
  res.redirect('/admin/products');
});

router.get('/admin/products/edit/:id', ensureAuthorized("admin"), async (req, res) => {
  const products = await clientDB.lookupByMakeupId_V2(req.params.id);
  if (!products) return res.status(404).send("Products not found");

  const product = products.makeupIdLookup[0];

  console.log("Product ID:", product);
  res.render('adminEditProduct', { product : product });
});

router.post('/admin/products/edit/:id', ensureAuthorized("admin"), async (req, res) => {
  const { name, category, price, quantity, brand } = req.body;
  const productId = req.params.id;
    try {
        const updatedProduct = await clientDB.updateProduct(productId, {
            name,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            brand
        });

        res.redirect('/admin/products');
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product.");
    }
});

router.post('/admin/products/delete/:id', ensureAuthorized("admin"), async (req, res) => {
  await clientDB.deleteProduct(req.params.id);
  res.redirect('/admin/products');
});

//Admin with specific customer id route
router.get('/admin/customer/:id', ensureAuthorized('admin'), async (req, res) => {
  const customerId = req.params.id;
  const orders = await clientDB.getCustomerOrders(customerId);
  console.log("Orders", orders);
  res.render('customerOrders', { customerId, orders: orders.getCustomerOrders });
});

//Admin edit specific order route
router.get('/admin/orders/edit/:orderId', ensureAuthorized('admin'), async (req, res) => {
  const orderId = req.params.orderId;
  const order = await clientDB.lookupByOrderId(orderId);
  console.log("Order by lookup index", order);
  if (!order) {
    return res.status(404).send('Order not found');
  }

  res.render('editOrder', { order: order.orderIdLookup });
});

//Post route when editing order
router.post('/admin/orders/edit/:orderId', ensureAuthorized('admin'), async (req, res) => {
  const orderId = req.params.orderId;

  const updatedItems = [];
  if (Array.isArray(req.body.productId)) {
    for (let i = 0; i < req.body.productId.length; i++) {
      updatedItems.push({
        productId: req.body.productId[i],
        name: req.body.name[i],
        quantity: parseInt(req.body.quantity[i]),
        price: parseFloat(req.body.price[i])
      });
    }
  } else {
    updatedItems.push({
      productId: req.body.productId,
      name: req.body.name,
      quantity: parseInt(req.body.quantity),
      price: parseFloat(req.body.price)
    });
  }

  const total = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  try {
    const updateData = {
      items: updatedItems,
      total: total
    };

    await clientDB.updateOrder(orderId, updateData);
    res.redirect(`/admin/customer/${req.body.customerId}`);
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).send("Failed to update order.");
  }
});



// POST route to delete a customer order
router.post('/admin/orders/delete/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const deleteMessage = await clientDB.deleteOrder(orderId);
    console.log(`Order deleted: ${deleteMessage}`);
    res.redirect('back');
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send("Failed to delete order.");
  }
});

router.get('/orders', ensureAuthenticated, async function (req, res) {
  try {
    const customerId = req.user.id;
    const orders = await clientDB.getCustomerOrders(customerId);
    res.render('orderHistory', { orders: orders.getCustomerOrders, user: req.user });
  } catch (error) {
    console.error("Failed to fetch order history:", error);
    res.status(500).send("Failed to fetch order history");
  }
});

router.get('/shop', ensureAuthenticated, async function (req, res) {
  try {
    const products = await clientDB.allMakeup();
    res.format({
      'application/json': function() {
        res.json({products});
      },
      'text/html': function() {
        res.render('productListView', 
          {products});
      }});
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server Error");
  }
});

router.get('/price', ensureAuthenticated, async function (req, res) {
  if (req.query.minPrice && req.query.maxPrice) {
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    let result = await clientDB.lookupByMakeupPriceRange(minPrice, maxPrice);
    res.format({
      'application/json': function() {
        res.json({makeup: result});
      },
      'text/html': function() {
        res.render('productsByPriceRange', 
          {makeup: result, min: minPrice, max: maxPrice});
      }});
  } else {
    res.render('lookupByPrice');
  }
});

router.post('/price', async function (req, res) {
  let minPrice = parseFloat(req.body.minPrice);
  let maxPrice = parseFloat(req.body.maxPrice);
  let result = await clientDB.lookupByMakeupPriceRange(minPrice, maxPrice);
  console.log("Result", result);
  res.render('productsByPriceRange',
    { products: result.makeupPriceRangeLookup });
});

router.get('/mid', ensureAuthenticated, async function (req, res) {
  if (req.query.id) {
    let id = req.query.id;
    let result = await clientDB.lookupByMakeupId_V2(id);

    if (!req.session.sessionData['lookupByMakeupId'].includes(encodeURIComponent(id)))
      req.session.sessionData['lookupByMakeupId'].push(encodeURIComponent(id));

    res.format({
      'application/json': function() {
        res.json({ query: id, makeup: result });
      },
      'text/html': function() {
        res.render('lookupByMakeupIdView', 
          { query: id, makeup: result });
      }});
  } else {
    res.render('lookupByMakeupIdForm');
  }
});

router.post('/mid', async function (req, res) {
  let id = req.body.id;
  let result = await clientDB.lookupByMakeupId_V2(id);

  if (!req.session.sessionData['lookupByMakeupId'].includes(encodeURIComponent(id)))
    req.session.sessionData['lookupByMakeupId'].push(encodeURIComponent(id));


  res.render('lookupByMakeupIdView',
    { query: id, makeup: result });
});

router.get('/mname', ensureAuthenticated, async function (req, res) {
  if (req.query.name) {
    let name = req.query.name;
    let result = await clientDB.lookupByMakeupName(name);

    if (!req.session.sessionData['lookupByMakeupName'].includes(encodeURIComponent(name)))
      req.session.sessionData['lookupByMakeupName'].push(encodeURIComponent(name));

    res.format({
      'application/json': function() {
        res.json({ query: id, makeup: result.makeupNameLookup });
      },
      'text/html': function() {
        res.render('lookupByMakeupNameView', 
          { query: id, makeup: result.makeupNameLookup });
      }});
  } else {
    res.render('lookupByMakeupNameForm');
  }

});

router.post('/mname', async function (req, res) {

  let name = req.body.name;
  let result = await clientDB.lookupByMakeupName(name);

  if (!req.session.sessionData['lookupByMakeupName'].includes(encodeURIComponent(name)))
    req.session.sessionData['lookupByMakeupName'].push(encodeURIComponent(name));

  res.render('lookupByMakeupNameView',
    { query: name, makeup: result.makeupNameLookup });

});

router.get('/bid', ensureAuthenticated, async function (req, res) {
  if (req.query.id) {
    let id = req.query.id;
    let result = await clientDB.lookupByBrandId_V1(id);

    if (!req.session.sessionData['lookupByBrandId'].includes(encodeURIComponent(id)))
      req.session.sessionData['lookupByBrandId'].push(encodeURIComponent(id));

    res.render('lookupByBrandIdView',
      { query: id, brands: result.brandIdLookup });
  } else {
    res.render('lookupByBrandIdForm');
  }
});

router.post('/bid', async function (req, res) {
  let id = req.body.id;
  let result = await clientDB.lookupByBrandId_V1(id);

  if (!req.session.sessionData['lookupByBrandId'].includes(encodeURIComponent(id)))
    req.session.sessionData['lookupByBrandId'].push(encodeURIComponent(id));


  res.render('lookupByBrandIdView',
    { query: id, brands: result.brandIdLookup });
});

router.get('/bname', ensureAuthenticated, async function (req, res) {

  if (req.query.name) {
    let name = req.query.name;
    let result = await clientDB.lookupByBrandName(name);

    if (!req.session.sessionData['lookupByBrandName'].includes(encodeURIComponent(name)))
      req.session.sessionData['lookupByBrandName'].push(encodeURIComponent(name));

    res.render('lookupByBrandNameView',
      { query: name, brands: result.brandNameLookup });
  } else {
    res.render('lookupByBrandNameForm');
  }

});

router.post('/bname', async function (req, res) {
  let name = req.body.name;
  let result = await clientDB.lookupByBrandName(name);
  console.log("Brand Lookup Result:", JSON.stringify(result, null, 2));

  if (!req.session.sessionData['lookupByBrandName'].includes(encodeURIComponent(name)))
    req.session.sessionData['lookupByBrandName'].push(encodeURIComponent(name));

  res.render('lookupByBrandNameView',
    { query: name, brand: result.brandNameLookup });

});

router.get('/cart', ensureAuthenticated, (req, res) => {
  res.render('cartView', { cart: req.session.cart });
});

router.post('/cart/add/:id', async (req, res) => {
  let id = req.params.id;
  const result = await clientDB.lookupByMakeupId_V1(id);

  const productData = result.makeupIdLookup ? result.makeupIdLookup[0] : null;

  if (!productData) return res.status(404).send("Product not found");
  console.log("Cart before adding:", JSON.stringify(req.session.cart, null, 2));

  let product = { ...productData };
  product.price = parseFloat(product.price) || 0;
  const itemIndex = req.session.cart.findIndex(item => item._id.toString() === product._id.toString());

  if (itemIndex >= 0) {
    req.session.cart[itemIndex].quantity += 1;
  } else {
    req.session.cart.push({ ...product, quantity: 1 });
  }
  res.redirect('/cart');
});

router.post('/cart/update/:id', (req, res) => {
  const { quantity } = req.body;
  const itemIndex = req.session.cart.findIndex(item => item._id === req.params.id);

  if (itemIndex >= 0) {
    req.session.cart[itemIndex].quantity = parseInt(quantity);
    if (req.session.cart[itemIndex].quantity <= 0) {
      req.session.cart.splice(itemIndex, 1);
    }
  }

  res.redirect('/cart');
});

router.post('/cart/remove/:id', (req, res) => {
  req.session.cart = req.session.cart.filter(item => item._id !== req.params.id);
  res.redirect('/cart');
});

router.post("/cart/checkout", ensureAuthenticated, async (req, res) => {
  try {
    const customerId = req.user.id;

    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).send("Cart is empty");
    }

    const cartItems = req.session.cart.map(item => ({
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderResponse = await clientDB.addOrder(customerId, cartItems);

    console.log("Order submitted successfully!", orderResponse);
    req.session.cart = [];
    res.render('orderConfirmation', { order: orderResponse.submitOrder, user: req.user });

  } catch (error) {
    console.error("Checkout failed:", error);
    res.status(500).send("Failed to complete checkout. Please try again.");
  }
});


router.get('/', function (req, res) {
  console.log("User", req.user);
  res.render('index', { user: req.user });
});

router.get('/login', function (req, res) {
  const messages = req.session.messages || [];
  req.session.messages = [];
  res.render(
    'login_local', {
    user: req.user,
    messages: messages
  });
  console.log(messages);
});

router.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/',
      failureRedirect: '/login',
      failureMessage: true
    }));


router.get('/account', ensureAuthenticated,
  function (req, res) {
    res.render(
      'account_local', { user: req.user })
  });

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/register', function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/account');
}
  res.render('register');
});

router.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    const existingUser = await clientDB.lookupExistingCustomer(email);
    console.log("index result:", existingUser);
    if (existingUser.existingCustomerLookup != null) {
      return res.status(400).send("User already exists");
    }

    await clientDB.addCustomer(name, email, username, password);
    res.redirect("/login");
  } catch (err) {
    console.log("Error:", err)
    res.status(500).send("Error registering user");
  }
});






export { router };
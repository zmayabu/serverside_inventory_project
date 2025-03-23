import mongoose from 'mongoose';
import { dbURL } from "./credentials.js";
import { Makeup, Brand, Customer, Order } from
	'./models/index.js';

export const connection = await mongoose.connect(dbURL);

// Server apollo module functions -------------------------

//Brand and Makeup related functions ------------

//Find a Makeup within the price range
export const lookupByPriceRange = async (min, max) => {
	console.log("\n Lookup by Makeup Price Range");
	return await Makeup.find({ price: { $gte: min, $lte: max } });
};

//Find Makeup by ID
export const lookupByMakeupId = async (id) => {
	console.log("\nLookup by MakeupId:", id);
	let mid = id?.trim();
	if (!mid)
		return [];

	let result = await Makeup.find({ _id: new RegExp(mid) });

	if (result)
		return result;
	else
		return [];
};

//Find Makeup by name
export const lookupByMakeupName = async (name) => {
	console.log("\nLookup by MakeupName:", name);
	let mname = name?.trim();
	if (!mname)
		return [];

	let result = await Makeup.find(
		{ name: new RegExp(mname, 'i') });

	if (result)
		return result;
	else
		return [];
};

//Lookup Brand by ID
export const lookupByBrandId = async (id) => {
	console.log("\nLookup by BrandId:", id);
	let bid = id?.trim();
	if (!bid)
		return [];

	let result = await Brand.find({ _id: new RegExp(bid) }).populate("products");

	if (result)
		return result;
	else
		return [];
};

//Lookup Brand by Name
export const lookupByBrandName = async (name) => {
	console.log("\nLookup by BrandName:", name);
	let bname = name?.trim();
	if (!bname)
		return [];

	let result = await Brand.find(
		{ name: new RegExp(bname, 'i') });

	if (result)
		return result;
	else
		return [];
};

//Lookup all Makeup
export const findallMakeup = async () => {
	console.log("\nLookup all makeup:");
	let result = await Makeup.find();
	return result;
};


//Customer related functions --------------

//Validate Customer for passport.js
export const validateUser = async (name, password) => {
	return await Customer.findOne({ username: name, password: password });
}

//Lookup Customer by Email
export const existingUser = async (email) => {
	console.log("\n Lookup By CustomerEmail", email);
	return await Customer.findOne({ email });
}

//Add a Customer
export const registerUser = async (name, email, username, password) => {
	console.log("Adding Customer... ");
	try {
		const newId = await Customer.countDocuments() + 1;
		const stringNewId = newId.toString();
		const newUser = new Customer({
			_id: stringNewId,
			role: "customer",
			name: name,
			email: email,
			username: username,
			password: password
		});

		await newUser.save();
		return newUser;
	} catch (error) {
		console.error('User registration failed:', error);
		throw error;
	}

};

//Lookup all Customers
export const findallCustomers = async () => {
	console.log("\nLookup all Customers");
	return await Customer.find();
};

//Order related functions ----------------------

//Lookup Order by ID
export const getOrderById = async (id) => {
	console.log("\nLookup by OrderId");
	return await Order.findOne({ _id: id });
}

//Lookup all Orders
export const findallOrders = async () => {
	console.log("\nLookup all Orders:");
	return await Order.find();
};

//Lookup Order(s) by Customer ID
export const getCustomerOrders = async (id) => {
	console.log("\nLookup Order by Customer Id:", id);
	let cid = id?.trim();
	if (!cid)
		return [];

	let result = await Order.find({ customerId: cid });

	if (result)
		return result;
	else
		return [];
};

//Add an Order
export const submitOrder = async (customerId, cartItems) => {
	try {
		console.log("Trying Submit Order for:", customerId);
		console.log("With cart items: ", cartItems);

		// Validate stock for each product
		for (const item of cartItems) {
			const product = await Makeup.findById(item.productId);

			if (!product || product.quantity < item.quantity) {
				throw new Error(`Insufficient stock for product: ${product?.name || "Unknown product"}`);
			}
		}

		// Proceed with order 
		const newId = await Order.countDocuments() + 1;
		const stringNewId = newId.toString();
		const newOrder = new Order({
			_id: stringNewId,
			customerId: customerId,
			items: cartItems.map(item => ({
				productId: item.productId,
				name: item.name,
				quantity: item.quantity,
				price: item.price
			})),
			total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
		});

		await newOrder.save();

		// Update product quantities
		for (const item of cartItems) {
			await Makeup.findByIdAndUpdate(item.productId, {
				$inc: { quantity: -item.quantity }
			});
		}

		return newOrder;
	} catch (error) {
		console.error('Order submission failed:', error);
		throw error;
	}
};

//Functions related to Admin Customers (Users) -----------------

//Add a Makeup
export const addProduct = async (productData) => {
	console.log("\nTrying to add makeup with data:", productData);
	const newId = await Makeup.countDocuments() + 1;
	const stringNewId = newId.toString();
	const newProduct = new Makeup({
		_id: stringNewId,
		name: productData.name,
		category: productData.category,
		price: productData.price,
		quantity: productData.quantity,
		brand: productData.brand,
		description: productData.description
	});
	await newProduct.save();
	return newProduct;
};

//Update a Makeup
export const updateProduct = async (id, productData) => {
	console.log("\nUpdating Makeup:", id);
	console.log("\nWith data: ", productData);
	return await Makeup.findByIdAndUpdate(id, productData, { new: true });
};

//Delete a Makeup
export const deleteProduct = async (id) => {
	console.log("\nDeleting Makeup:", id);
	await Makeup.findByIdAndDelete(id);
	return `Makeup with id ${id} has been deleted.`;
};

//Update an Order
export const updateOrder = async (orderId, orderData) => {
	console.log("\nUpdating Order:", orderId);
	console.log("\nWith data: ", orderData);
	return await Order.findByIdAndUpdate(orderId, orderData, { new: true });
};

//Delete an Order
export const deleteOrder = async (orderId) => {
	console.log("\nDeleting Order:", orderId);
	await Order.findByIdAndDelete(orderId);
	return `Order with id ${orderId} has been deleted.`;
};





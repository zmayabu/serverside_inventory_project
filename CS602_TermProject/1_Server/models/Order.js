import mongoose from 'mongoose';

//Schema for Order

const orderSchema = new mongoose.Schema({
    _id: String,
    customerId: { type: String, ref: 'Customer' },
    items: [
        {
            productId: { type: String, ref: 'Makeup'},
            name: {type: String, ref: 'Makeup'},
            quantity: Number,
            price: {type: String, ref: 'Makeup'}
        }
    ],
    total: Number
}, {collection: 'Order'});

const Order = mongoose.model('Order', orderSchema);

export {Order};

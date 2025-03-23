import mongoose from "mongoose";

//Schema for Customer (technically it's a user schema. Unfortunately I named it too early.)

const customerSchema = new mongoose.Schema({
    _id: { type: String },
    role: String,
    name: String,
    email: String,
    username: String,
    password: String,
}, {collection: 'Customer'});

const Customer = mongoose.model("Customer", customerSchema);
export { Customer };

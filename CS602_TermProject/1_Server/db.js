import fs from 'node:fs';

import { MongoClient, ServerApiVersion } 
  from "mongodb";

import {dbURL}  from "./credentials.js";

console.log(dbURL);

const client = new MongoClient(dbURL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

await client.connect();
    
console.log('Successfully connected to', 
    client.s.options.dbName);

let result;

const json1Data = fs.readFileSync('./1_Server/makeup_inventory.json');
const makeupData = JSON.parse(json1Data);
console.log("Read", makeupData.length, "makeup");

const makeupCollection = client.db("cs602_termproject").collection("Makeup");
await makeupCollection.deleteMany({});
result = await makeupCollection.insertMany(makeupData);
console.log('Inserted Ids:', result.insertedIds);

const json2Data = fs.readFileSync('./1_Server/brands.json');
const brandData = JSON.parse(json2Data);
console.log("Read", brandData.length, "brands");

const brandCollection = client.db("cs602_termproject").collection("Brand");
await brandCollection.deleteMany({});
result = await brandCollection.insertMany(brandData);
console.log('Inserted Ids:', result.insertedIds);

const json3Data = fs.readFileSync('./1_Server/initial_customers.json');
const customerData = JSON.parse(json3Data);
console.log("Read", customerData.length, "customers");

const customerCollection = client.db("cs602_termproject").collection("Customer");
await customerCollection.deleteMany({});
result = await customerCollection.insertMany(customerData);
console.log('Inserted Ids:', result.insertedIds);

const json4Data = fs.readFileSync('./1_Server/initial_orders.json');
const orderData = JSON.parse(json4Data);
console.log("Read", orderData.length, "orders");

const orderCollection = client.db("cs602_termproject").collection("Order");
await orderCollection.deleteMany({});
result = await orderCollection.insertMany(orderData);
console.log('Inserted Ids:', result.insertedIds);

await client.close();
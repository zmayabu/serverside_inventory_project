// File: server_graphQL_apollo.js

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer }
  from '@apollo/server/standalone';

import { Makeup, Brand, Customer } from './models/index.js';

import * as productDB
  from './productModule.js';

const typeDefs_Queries = `#graphql
  type Makeup {
  _id: String!,
  name: String!,
  brand: Brand!,
  category: String!,
  price: Float!,
  quantity: Int!,
  description: String!
  }

  type Brand {
  _id: String!,
  name: String!,
  country: String!,
  products: [Makeup]! 
  }

  type Customer {
  _id: String!,
  role: String!,
  name: String!,
  email: String!,
  username: String!,
  password: String!,
  }

  type OrderItem {
  productId: String!,
  name: String!,
  quantity: Int!,
  price: Float!
  }

  type Order {
  _id: String!,
  customerId: String!,
  items: [OrderItem!]!,
  total: Float!
  }

  type Query {
  allMakeup: [Makeup]!
  brands: [Brand]!
  allCustomers: [Customer]!
  allOrders: [Order]!
  makeupPriceRangeLookup(minPrice: Float!, maxPrice: Float!): [Makeup]!
  makeupIdLookup(id: String!): [Makeup]!
  makeupNameLookup(name: String!): [Makeup]!
  brandIdLookup(id: String!): [Brand]!
  brandNameLookup(name: String!): [Brand]!
  existingCustomerLookup(email: String!): Customer
  getCustomerOrders(customerId: String!): [Order]!
  orderIdLookup(id: String!): Order
  }
`
const typeDefs_Mutations = `#graphql
  type Mutation {
  addCustomer(customerData: AddCustomerInput!): Customer
  submitOrder(customerId: String!, items: [OrderItemInput!]!): Order
  addProduct(productData: ProductInput!): Makeup
  updateProduct(id: String!, productData: ProductInput!): Makeup
  deleteProduct(id: String!): String
  updateOrder(orderId: String!, orderData: OrderInput!): Order
  deleteOrder(orderId: String!): String
  }

  input AddCustomerInput {
  name: String!
  email: String!
  username: String!
  password: String!
  }

  input OrderInput {
  items: [OrderItemInput!]!
  total: Float!
  }

  input OrderItemInput {
  productId: String!
  name: String
  quantity: Int
  price: Float
  }

  input ProductInput {
  name: String!
  category: String!
  price: Float!
  quantity: Int!
  brand: String!
  description: String
  } 

`

const resolvers_Queries = {
  Query: {

    makeupPriceRangeLookup: async (parent, args, context) => {
      console.log("\nQuery lookup Makeup by Price...")
      return await productDB.lookupByPriceRange(args.minPrice, args.maxPrice);
    },
    makeupIdLookup: async (parent, args, context) => {
      console.log("\nQuery lookup makeup by Id:", args.id)
      return await productDB.lookupByMakeupId(args.id);
    },
    makeupNameLookup: async (parent, args, context) => {
      console.log("\nQuery lookup makeup by Name:", args.name)
      return await productDB.lookupByMakeupName(args.name);
    },
    brandIdLookup: async (parent, args, context) => {
      console.log("\nQuery lookup brand by Id:", args.id)
      return await productDB.lookupByBrandId(args.id);
    },
    brandNameLookup: async (parent, args, context) => {
      console.log("\nQuery lookup brand by Name:", args.name)
      return await productDB.lookupByBrandName(args.name);
    },
    allMakeup: async () => {
      console.log("\nQuery lookup all makeup...");
      return await productDB.findallMakeup();  
    },
    existingCustomerLookup: async (parent, args, context) => {
      console.log("\nQuery lookup customer by Email:", args.email)
      const result = await productDB.existingUser(args.email);
      console.log("Server result:", result)
      return result;
    },
    allCustomers: async () => {
      console.log("\nQuery lookup all customers...");
      return await productDB.findallCustomers();      
    },
    orderIdLookup: async (parent, args, context) => {
      console.log("\nQuery lookup order by Id:", args.id)
      return await productDB.getOrderById(args.id);
    },
    allOrders: async () => {
      console.log("\nQuery lookup all orders...");
      return await productDB.findallOrders();     
    },
    getCustomerOrders: async (parent, args, context) => {
      console.log("\nQuery lookup order by customer Id:", args.customerId);
      return await productDB.getCustomerOrders(args.customerId);
    }
  },

  // chain resolver for Makeup -> Brand
  Makeup: {
    brand: async (parent, args, context) => {
      console.log(" (2) Parent makeup id", parent._id, " Args", args);
      const result = await parent.populate("brand");
      return result.brand;
    }
  },

  // chain resolver for Brand -> Makeup Products
  Brand: {
    products: async (parent, args, context) => {
      console.log(" (2) Parent brand id", parent._id, "Args", args);
      // fill in the code
      const result = await parent.populate("products");
      return result.products;

    }
  },
};

const resolvers_Mutations = {
  Mutation: {
    addCustomer: async (parent, args, context) => {
      console.log("\nMutation add customer with args:", args);
      const { customerData } = args;
      return await productDB.registerUser(
      customerData.name, customerData.email, customerData.username, customerData.password);
    },
    addProduct: async (parent, args, context) => {
      console.log("\nMutataion add makeup with args:", args);
      return await productDB.addProduct(args.productData);
    },
    deleteProduct: async (parent, args, context) => {
      console.log("\nMutation delete makeup with args:", args);
      return await productDB.deleteProduct(args.id);
    },
    updateProduct: async (parent, args, context) => {
      console.log("\nMutation update makeup args", args);
      return await productDB.updateProduct(args.id, args.productData);
    },
    submitOrder: async (parent, args, context) => {
      console.log("\nMutation add order with args:", args);
      return await productDB.submitOrder(args.customerId, args.items);
    },
    updateOrder: async (parent, args, context) => {
      console.log("\nMutation update order with args:", args);
      return await productDB.updateOrder(args.orderId, args.orderData);
    },

    deleteOrder: async (parent, args, context) => {
      console.log("\nMutation delete order with args", args);
      return await productDB.deleteOrder(args.orderId);
    }
  }
};

const server = new ApolloServer(
  {
    typeDefs: [typeDefs_Queries, typeDefs_Mutations],
    resolvers: [resolvers_Queries, resolvers_Mutations]
  });


const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

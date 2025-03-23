import * as clientModule from './clientProductModule.js'

//Testing file for Client Module functions ------------------------------------------

let result;


// console.log("\nQuery makeup by id - Basic Info");
// result = await clientModule.lookupByMakeupId_V1("1");
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery makeup by id - with associated information");
// result = await clientModule.lookupByMakeupId_V2("2");
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery makeup by name ");
// result = await clientModule.lookupByMakeupName("Red");
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery brand by name ");
// result = await clientModule.lookupByBrandName("may");
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery brand by id ");
// result = await clientModule.lookupByBrandId_V1("M1");
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery all makeup ");
// result = await clientModule.allMakeup();
// console.log(JSON.stringify(result, null, 2));

console.log("\nMutation add Customer");
result = await clientModule.addCustomer("kelly", "kelly@bing.com", "kellyg", "8900");
console.log(JSON.stringify(result, null, 2));


// console.log("\nQuery all orders ");
// result = await clientModule.allOrders();
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery customer orders ");
// result = await clientModule.getCustomerOrders("2");
// console.log(JSON.stringify(result, null, 2));

// console.log("\n Mutation customer order ");
// result = await clientModule.addOrder("1", [{
//     "productId": "3",
//     "name": "Smoky Eyeshadow Palette",
//     "quantity": 1,
//     "price": 29.99
// }]);
// console.log(JSON.stringify(result, null, 2));

// console.log("\n Mutation product addition ");
// result = await clientModule.addProduct({
//     "name": "Black Liner",
//     "category": "EyeLiner",
//     "price": 12.99,
//     "quantity": 40,
//     "brand": "M1",
//     "description": "A nice black liner."
// });
// console.log(JSON.stringify(result, null, 2));

// console.log("\n Mutation product update ");
// result = await clientModule.updateProduct("6", {
//     "name": "Black Liner",
//     "category": "Liquid Liner",
//     "price": 35.90,
//     "quantity": 55,
//     "brand": "M1",
//     "description": "A nice liquid black liner."
// });
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery delete product ");
// result = await clientModule.deleteProduct("6");
// console.log(JSON.stringify(result, null, 2));

// console.log("\n Mutation for order update");
// result = await clientModule.updateOrder("2", {
//     items: [
//         {
//             productId: "1",
//             name: "Red Lipstick",
//             quantity: 2,
//             price: 12.99
//         }
//     ],
//     total: 25.98
// });
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery lookupId order ");
// result = await clientModule.lookupByOrderId("1");
// console.log(JSON.stringify(result, null, 2));

// console.log("\nQuery lookup by price range makeup ");
// result = await clientModule.lookupByMakeupPriceRange(10, 20);
// console.log(JSON.stringify(result, null, 2));

clientModule.client.clearStore();
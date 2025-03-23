import { ApolloClient, InMemoryCache, gql }
	from "@apollo/client/core/core.cjs";

const baseServerURL = "http://localhost:4000";

export const client = new ApolloClient({
	uri: `${baseServerURL}`,
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: 'network-only',
		}
	}
});

// Client apollo module functions -------------------------

//1 - Queries --------

//Lookeup by Makeup ID simple
export const lookupByMakeupId_V1 = async (id) => {
	console.log("\nLookup by MakeupId (V1):", id);

	const QUERY_GET_BY_MAKEUP_ID_V1 =
		`query Makeup($makeupIdLookupId: String!) {
		  makeupIdLookup(id: $makeupIdLookupId) {
		    _id
		    name
			price
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_BY_MAKEUP_ID_V1),
		variables: { makeupIdLookupId: id }
	});

	return result.data;
};

//Lookup by Makeup ID complete
export const lookupByMakeupId_V2 = async (id) => {
	console.log("\nLookup by MakeupId (V2):", id);

	const QUERY_GET_BY_MAKEUP_ID_V2 =
		`query Makeup($makeupIdLookupId: String!) {
		  makeupIdLookup(id: $makeupIdLookupId) {
		    _id
		    name
            brand {
			_id
			name
			country
			}
            category
            price
            quantity
            description

			
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_BY_MAKEUP_ID_V2),
		variables: { makeupIdLookupId: id }
	});

	return result.data;


};

//Lookup by Makeup Price Range
export const lookupByMakeupPriceRange = async (minPrice, maxPrice) => {
	console.log("\nLookup by Makeup Price Range:", minPrice, " and ", maxPrice);
	const QUERY_GET_BY_MAKEUP_BY_PRICE =
		`query Makeup($minPrice: Float!, $maxPrice: Float!) {
		  makeupPriceRangeLookup(minPrice: $minPrice, maxPrice: $maxPrice) {
		    _id
		    name
            brand {
			name
			}
            category
            price
            quantity
            description
			
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_BY_MAKEUP_BY_PRICE),
		variables: { minPrice: minPrice, maxPrice: maxPrice }
	});

	return result.data;


};

//Lookup by Makeup Name
export const lookupByMakeupName = async (name) => {
	console.log("\nLookup by MakeupName:", name);

	const QUERY_GET_BY_MAKEUP_NAME =
		`query Makeup($makeupNameLookupName: String!) {
		  makeupNameLookup(name: $makeupNameLookupName) {
		    _id
		    name
            brand {
			name
			}
            category
            price
            quantity
            description
			
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_BY_MAKEUP_NAME),
		variables: { makeupNameLookupName: name }
	});

	return result.data;


};

//Lookup by Brand Name
export const lookupByBrandName = async (name) => {
	console.log("\nLookup by BrandName:", name);

	const QUERY_GET_BY_BRAND_NAME =
		`query Brand($brandNameLookupName: String!) {
			brandNameLookup(name: $brandNameLookupName) {
			_id
			  name
			  country
			  products {
			  _id
			 	name
				category
				price
				quantity 
				description
			  }
			  
			}
		  }
		  `;

	const result = await client.query({
		query: gql(QUERY_GET_BY_BRAND_NAME),
		variables: { brandNameLookupName: name }
	});

	return result.data;


};

//Lookup by Brand ID
export const lookupByBrandId_V1 = async (id) => {
	console.log("\nLookup by BrandId (V1):", id);

	const QUERY_GET_BY_BRAND_ID_V1 =
		`query Brand($brandIdLookupId: String!) {
		  brandIdLookup(id: $brandIdLookupId) {
		    _id
		    name
			country
			products {
			_id
			name
			category
			price
			quantity
			description
  			}
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_BY_BRAND_ID_V1),
		variables: { brandIdLookupId: id }
	});

	return result.data;
};

//Lookup all Makeup
export const allMakeup = async () => {
	console.log("\nLookup by all makeup");

	const QUERY_GET_ALL_MAKEUP =
		`query Makeup {
		allMakeup {
		  _id
		  name
		  brand {
		 name 
		  }
		 category
		 price
		 quantity
		 description
} }
	
		`;

	const result = await client.query({
		query: gql(QUERY_GET_ALL_MAKEUP)
	});

	console.log("Result", result);
	return result.data;
};

//Lookup Customer by Email
export const lookupExistingCustomer = async (email) => {
	console.log("\nLookup existing Customer:", email);

	const QUERY_GET_EXISTING_CUSTOMER =
		`query Customer($customerEmailLookupEmail: String!) {
		  existingCustomerLookup(email: $customerEmailLookupEmail) {
		    _id
		    name
			email
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_EXISTING_CUSTOMER),
		variables: { customerEmailLookupEmail: email }
	});

	console.log("Client result:", result);

	return result.data;
};

//Lookup Order(s) by Customer ID
export const getCustomerOrders = async (id) => {
	console.log("\nLookup orders by customer", id);

	const QUERY_GET_CUSTOMER_ORDERS =
		`query Order($customerIdLookupId: String!) {
		  getCustomerOrders(customerId: $customerIdLookupId) {
		    _id
		  customerId
		  items {
		 productId
		 name
		 quantity
		 price 
		  }
		 total
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_CUSTOMER_ORDERS),
		variables: { customerIdLookupId: id }
	});

	return result.data;
};

//Lookup by all Customers
export const getAllCustomers = async () => {
	console.log("\nLookup all customers");

	const QUERY_GET_ALL_CUSTOMERS =
		`query Customer {
		  allCustomers {
		    _id
		  name
		  email
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_ALL_CUSTOMERS)
	});

	return result.data;
};

//Lookup Order by Order ID
export const lookupByOrderId = async (id) => {
	console.log("\nLookup by OrderId:", id);

	const QUERY_GET_BY_ORDER_ID =
		`query Order($orderIdLookupId: String!) {
		  orderIdLookup(id: $orderIdLookupId) {
		    _id
		  customerId
		  items {
		 productId
		 name
		 quantity
		 price 
		  }
		 total
		  }
		}
		`;

	const result = await client.query({
		query: gql(QUERY_GET_BY_ORDER_ID),
		variables: { orderIdLookupId: id }
	});

	return result.data;
};

//Lookup by all Orders
export const allOrders = async () => {
	console.log("All Orders Client!");

	const QUERY_GET_ALL_ORDERS =
		`query Order {
		allOrders {
		  _id
		  customerId
		  items {
		 productId
		 name
		 quantity
		 price 
		  }
		 total
} }
	
		`;

	const result = await client.query({
		query: gql(QUERY_GET_ALL_ORDERS)
	});

	console.log("Result", result);
	return result.data;
};

// 2 - Mutations --------------

//Add Customer by Name, Email, Username, and Password
export const addCustomer = async (name, email, username, password) => {
	console.log("\nAdding customer with data...");

	const MUTATION_ADD_A_CUSTOMER =
	`mutation Mutation($customerData: AddCustomerInput!) {
  	addCustomer(customerData: $customerData) {
	_id
	role
    name
    email
	username
	password
  }
}
`;
	const result = await client.mutate({
		mutation: gql(MUTATION_ADD_A_CUSTOMER),
		variables: {
			customerData: {
				name: name,
				email: email,
				username: username,
				password: password
			}
		}
	});
	return result.data;


};


// Add Order by Customer ID and Makeup data
export const addOrder = async (customerId, cartItems) => {
	console.log("\nAdding order by Customer Id:", customerId, " with data:", cartItems);

	const MUTATION_ADD_AN_ORDER =
		`mutation Mutation($customerId: String!, $items: [OrderItemInput!]!) {
	  submitOrder(customerId: $customerId, items: $items) {
		_id
		customerId
		items {
		productId
		name
		quantity
		price
		}
		total
	  }
	}
	`;
	const result = await client.mutate({
		mutation: gql(MUTATION_ADD_AN_ORDER),
		variables: {
			customerId: customerId,
			items: cartItems
		}
	});
	return result.data;

};

// Add Makeup with data
export const addProduct = async (productData) => {
	console.log("\nAdding makeup with data:", productData);

	const MUTATION_ADD_A_PRODUCT =
	`mutation Mutation($productData: ProductInput!) {
	  addProduct(productData: $productData) {
		 _id
		  name
		  brand {
		 _id 
		  }
		 category
		 price
		 quantity
		 description
	  }
	}
	`;

	const result = await client.mutate({
		mutation: gql(MUTATION_ADD_A_PRODUCT),
		variables: {
			productData: productData,
		}
	});
	return result.data;


};

//Update a Makeup by ID
export const updateProduct = async (id, productData) => {
	console.log("\nUpdating makeup by id:", id, " with data:", productData);

	const MUTATION_UPDATE_A_PRODUCT =
	`mutation Mutation($id: String!, $productData: ProductInput!) {
		updateProduct(id: $id, productData: $productData) {
			_id
			name
			brand {
			_id 
			}
			category
			price
			quantity
			description
		}
	}
	`;

	const result = await client.mutate({
		mutation: gql(MUTATION_UPDATE_A_PRODUCT),
		variables: {
			id: id,
			productData: productData,
		}
	});
	return result.data;



};

//Delete a Makeup by ID
export const deleteProduct = async (id) => {
	console.log("\nDeleting makeup by ID:", id);

	const MUTATION_DELETE_A_PRODUCT =
	`mutation Mutation($id: String!) {
				deleteProduct(id: $id)
	}
	`;


	const result = await client.mutate({
		mutation: gql(MUTATION_DELETE_A_PRODUCT),
		variables: {
			id: id
		}
	});
	return result.data;


};

//Update an Order by ID with data
export const updateOrder = async (id, orderData) => {
	console.log("\nUpdating order by id:", id, " with data:", orderData);

	const MUTATION_UPDATE_AN_ORDER =
	`mutation Mutation($orderId: String!, $orderData: OrderInput!) {
		updateOrder(orderId: $orderId, orderData: $orderData) {
			_id
	customerId
	items {
	productId
	name
	quantity
	price
	}
	total
		}
	}
	`;

	const result = await client.mutate({
		mutation: gql(MUTATION_UPDATE_AN_ORDER),
		variables: {
			orderId: id,
			orderData: orderData,
		}
	});
	return result.data;


};

//Delete an Order by ID
export const deleteOrder = async (id) => {
	console.log("\nDeletion of Order by ID:", id);
	const MUTATION_DELETE_AN_ORDER =
	`mutation Mutation($orderId: String!) {
	 deleteOrder(orderId: $orderId)
	}
	`;

	const result = await client.mutate({
		mutation: gql(MUTATION_DELETE_AN_ORDER),
		variables: {
			orderId: id
		}
	});
	return result.data;


};







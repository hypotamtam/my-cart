# my-cart

My cart is a GraphQl backend that allows you to create `cart`, `list` the product available and add or remove an `item` to/from your cart.
It's done with **TypeScript**, **Node.js** and **[express-graphql](https://github.com/graphql/express-graphql)**. The data persistence is handle by a **PostgreSQL** database.

###Requirement 

To run this project you must have:

- node version 10.15.1
- docker

### How to start

```
docker-compose up
npm ci
npm run start
```

Then open [http://localhost:3000/cart](http://localhost:3000/cart)

### API

Use the GraphiQL web inteface to test the API.

#### List the product to add
You can access to the product catalog with the **product** query.

```
{
	products {
    id
    name
    price
  }
}
```

As you've probably understood that returns the `name` and the `price` of each product. The `id` is use to add or remove this product to your cart.

#### Create or list your cart

The **cart** query allows you to create a cart or list an existing one depending if the `cartId` parameter is present.

```
//Create a cart and get back it's id
{
  cart {
    id
  } 
}

//list the cart with the id 1
{
  cart(cartId: 1) {
    items {
      name
      price
      count
      total
    }
    total
  } 
}
```
The returns the current cart.

#### Add or remove an item to your cart

Call the **itemQuantityUpdate** mutation with your `cartId`, the `productId` and the product `delta` quantity to add or remove item.

```
mutation {
  itemQuantityUpdate(delta:4, productId:3, cartId:1){
    id
    items {
      id
      name
      price
      count
      total
    }
    total
  }
}
```

That gives you back your cart updated.

### Miscellaneous

The database is created and populated with the SQL script under `scripts/db`. They are run with [Flyway](https://flywaydb.org/) when you start the server. If you want to rerun them, the simple solution is to remove the Docker image and recreates it. Otherwise you can add a new script.

The code is cover by `Jest` unit test and also by `Cucumber` BDD test. They run when you start the server or with `npm run test`




import {Cart} from './dto/Cart';
import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {Context} from './GraphqlServer';
import {Product} from './dto/Product';

@Resolver(of => Cart)
export class CartResolver {

    @Query(returns => Cart)
    async cart(@Ctx() context: Context, @Arg("cartId", {defaultValue: null}) cartId?: number): Promise<Cart> {
        if (cartId) {
            const storedCart = await context.cartDbClient.findCart(cartId);
            return Cart.from(storedCart);
        } else {
            const newCart = await context.cartDbClient.createCart();
            newCart.items = [];
            await context.cartDbClient.saveCart(newCart);
            return Cart.from(newCart);
        }
    }

    @Query(returns => [Product])
    async products(@Ctx() context: Context) {
        const storeEntities = await context.cartDbClient.findAllStoreItem();
        return storeEntities.map(storeEntity => Product.from(storeEntity));
    }

    @Mutation(returns => Cart)
    async itemQuantityUpdate(@Ctx() context: Context, @Arg("cartId") cartId: number, @Arg("itemId") itemId: number, @Arg("delta") delta: number) {
        const cartEntity = await context.cartDbClient.doTransaction(async () => {
            const {cart, storeItem}  = await Promise.all([context.cartDbClient.findCart(cartId), context.cartDbClient.findStoreItem(itemId)])
                .then(result => ({cart: result[0], storeItem: result[1]}));

            const itemInCartIndex = cart.items.findIndex(item => item.storeItem.id === storeItem.id);
            if (itemInCartIndex !== -1) {
                const itemInCart = cart.items[itemInCartIndex];
                itemInCart.count += delta;
                if (itemInCart.count <= 0) {
                    cart.items.splice(itemInCartIndex, 1);
                    await context.cartDbClient.removeItem(itemInCart);
                }
            } else if (delta > 0) {
                const item = await context.cartDbClient.createItem();
                item.cart = cart;
                item.count = delta;
                item.storeItem = storeItem;
                cart.items.push(item);
            }
            return await context.cartDbClient.saveCart(cart);
        });

        return Cart.from(cartEntity);
    }
}

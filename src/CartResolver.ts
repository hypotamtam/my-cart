import {Cart} from './dto/Cart';
import {CartEntity}  from './db/entity/CartEntity'
import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {Context} from './GraphqlServer';
import {CartDbClient} from './db/client/CartDbClient';
import {ConnectionProvider} from './db/client/ConnectionProvider';
import {ItemEntity} from './db/entity/ItemEntity';
import {StoreItem} from './dto/StoreItem';

@Resolver(of => Cart)
export class CartResolver {

    @Query(returns => Cart)
    async cartQuery(@Ctx() context: Context, @Arg("cartId", {defaultValue: null}) cartId?: number): Promise<Cart> {
        const dbClient = new CartDbClient(await ConnectionProvider.getCartConnection());

        if (cartId) {
            const storedCart = await dbClient.findCart(cartId);
            return Cart.from(storedCart);
        } else {
            const newCart = await dbClient.createCart();
            newCart.items = [];
            await dbClient.saveCart(newCart);
            return Cart.from(newCart);
        }
    }

    @Query(returns => [StoreItem])
    async catalogueQuery(@Ctx() context: Context) {
        const dbClient = new CartDbClient(await ConnectionProvider.getCartConnection());

        const storeEntities = await dbClient.findAllStoreItem();
        return storeEntities.map(storeEntity => StoreItem.from(storeEntity));
    }

    @Mutation(returns => Cart)
    async itemQuantityUpdate(@Ctx() context: Context, @Arg("cartId") cartId: number, @Arg("itemId") itemId: number, @Arg("delta") delta: number) {
        const dbClient = new CartDbClient(await ConnectionProvider.getCartConnection());

        const cartEntity = await dbClient.doTransaction(async () => {
            const {cart, storeItem}  = await Promise.all([dbClient.findCart(cartId), dbClient.findStoreItem(itemId)])
                .then(result => ({cart: result[0], storeItem: result[1]}));

            const itemInCartIndex = cart.items.findIndex(item => item.storeItem.id === storeItem.id);
            if (itemInCartIndex !== -1) {
                const itemInCart = cart.items[itemInCartIndex];
                itemInCart.count += delta;
                if (itemInCart.count <= 0) {
                    cart.items.splice(itemInCartIndex, 1);
                    await dbClient.removeItem(itemInCart);
                }
            } else if (delta > 0) {
                const item = await dbClient.createItem();
                item.cart = cart;
                item.count = delta;
                item.storeItem = storeItem;
                cart.items.push(item);
            }
            return await dbClient.saveCart(cart);
        });

        return Cart.from(cartEntity);
    }
}

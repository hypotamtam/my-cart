import {after, before, binding, given, then, when} from "cucumber-tsflow";

@binding()
class MyCartSteps {

    @given(/^ a user with a cart$/)
    public a_user_with_a_cart() {
    }

    @given(/^the cart contains an+ (.*?) at (\d*)$/)
    public the_cart_contains(name: string, price: number){

    }

    @then(/^the cart item count is (\d*)$/)
    public the_cart_item_count_is(itemCount: number) {

    }

    @then(/^the price is (\d*)$/)
    public the_price_is(price: number) {

    }

}

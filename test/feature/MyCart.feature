@publish
Feature: My Cart

  Scenario: The user list its cart:
    Given a user with a cart
    And the cart contains an axe at 190.51
    And the cart contains a chisel at 13.99
    Then the cart item count is 2
    And the price is 204.50



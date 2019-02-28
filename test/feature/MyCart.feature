@publish
Feature: My Cart

  Scenario: The user list its cart:
    Given a user with a cart
    And the cart already contains an axe at 190.51
    And the cart already contains a chisel at 13.99
    Then the cart item count is 2
    And the cart price is 204.50

  Scenario: The user adds items to its cart:
    Given a user with a cart
    And the cart already contains an axe at 190.51
    When the user adds 2 chisel at 13.99
    Then the cart contains 2 chisel for 27.98
    Then the cart contains 1 axe for 190.51
    And the cart price is 218.49

  Scenario: The user removes an item from its cart:
    Given a user with a cart
    And the user already contains 2 chisel at 13.99
    When the user removes 2 chisel
    Then the cart item count is 0
    And the cart price is 0.00

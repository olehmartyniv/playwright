Feature: Ecommerce validations

  @regression
  Scenario: Placing the order
    Given login to Ecommerce application with "test000@mail.com" and "P@ss0000"
    When add "zara coat 3" to Cart
    Then verify "zara coat 3" is displayed in the Cart
    When enter valid details and place the order
    Then verify order is present in the Order History

  @regression
  Scenario: Placing the order
    Given login to Ecommerce application with "test001@mail.com" and "P@ss0001"
    When add "adidas original" to Cart
    Then verify "adidas original" is displayed in the Cart
    When enter valid details and place the order
    Then verify order is present in the Order History

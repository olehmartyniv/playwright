Feature: Practice validations

  @validations
  Scenario Outline: Incorrect credentials
    Given login page is opened
    When login to Ecommerce2 application with "<username>" and "<password>"
    Then verify error message is displayed

    Examples: 
      | username           | password |
      | rahulshetty        | learning |
      | rahulshettyacademy | wrong    |

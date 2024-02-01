// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('http://localhost:5173/')
//   })
// })
// describe('template spec', () => {
//   it('passes', () => {
//     // Wait for 10 seconds (adjust as needed)
//     cy.wait(10000);

//     // Visit the specified URL
//     cy.visit('http://localhost:5173/');
//   });
// });
//Import the required cy commands

// loginGoogle.spec.js
describe('Google Login Test', () => {
  it('should perform Google login and redirect accordingly', () => {
    const testEmail = 'ambikaangadi07@gmail.com'; // Replace with your test Gmail account
    const testPassword = ''; // Replace with your test Gmail account password

    // Visit the starting page
    cy.visit('http://aws2302.atrous.de');

    // // Click the "Login / Register with Google" button
    //cy.contains('Login / Register with Google').click();

    // Intercept the Google authentication endpoint 
    cy.intercept('GET', 'https://accounts.google.com/**').as('googleAuth');

    // Click the "Login / Register with Google" button
    cy.contains('Login / Register with Google').click();

    // Wait for the Google authentication request to complete
    cy.wait('@googleAuth');
    // Visit the expected origin before interacting with the elements
    //cy.visit('http://aws2302.atrous.de');

    // Ensure the page is loaded by waiting for a specific element
    cy.get('#initialView', { timeout: 10000 }).should('be.visible');

    // Simulate entering the test Gmail account credentials
    cy.get('input[type="email"]').type(testEmail);
    cy.contains('Next').click();

    // Ensure the password input field is visible before typing the password
    cy.get('input[type="password"]', { timeout: 5000 }).should('be.visible');
    cy.get('input[type="password"]').type(testPassword);

    cy.contains('Next').click();

    // Wait for the component to process the access token and navigate
    cy.wait(5000); // Adjust the wait time based on your application's behavior

    // Assert the redirection after a successful login
    cy.url().should('include', '/newacc'); // or '/newsfeed' based on your logic
  });
});

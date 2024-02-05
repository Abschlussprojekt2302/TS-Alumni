describe('Google', function () {
    let newBirthdate;
    let newCourse; 
    const user = {
        RealName: 'Ambika Angadi'
    };

    beforeEach(function () {
        cy.loginByGoogleApi();
    });

    it('New user registration, profile page', () => {
        cy.visit('http://aws2302.atrous.de/newacc');
        // Input new user data
        cy.get('.eingabefelder input[type="date"]').type('2000-01-01');
        cy.get('.eingabefelder input[type="text"]').type('2302');

        // Click the "Account erstellen" button
        cy.get('button').contains('Account erstellen').click();
        cy.contains('Ambika Angadi', { timeout: 10000 }).should('be.visible').invoke('addClass', 'menu-item').click();
        cy.get('.dropdown-content a.menu-item').contains('Profile').should('exist');
        cy.contains('Profile', { timeout: 10000 }).should('exist').click({ force: true });
        cy.get('.dropdown-content a.menu-item').contains('Logout').should('exist');
        // Assertions for initial user profile information
        cy.get('.appprofile .sidebar')
            .should('exist')
            .within(() => {
                cy.get('.logos').should('exist');
                cy.contains('Name:').should('exist');
                cy.contains('Birthdate:').should('exist');
                cy.contains('Course:').should('exist');
                cy.contains('Edit').should('exist');
                cy.contains('Edit').click();
                cy.wait(2000);
            });
        // Assertions for edit mode
        cy.get('.appprofile .sidebar')
            .should('exist')
            .within(() => {
                cy.get('input[type="date"]').should('exist');
                cy.get('input[type="text"]').should('exist');
                cy.contains('Save').should('exist');
                cy.contains('Cancel').should('exist');

                // Perform some interactions, e.g., type into the input fields
                newBirthdate = '2022-01-31';
                newCourse = 'AWS2302';

                cy.get('input[type="date"]').type(newBirthdate);
                cy.get('input[type="text"]').type(newCourse);

                // Click the Save button
                cy.contains('Save').click();
            });
        // Simulate page reload
        //cy.reload();
        // Assertions after saving changes
        cy.get('.appprofile .sidebar')
            .should('exist')
            .within(() => {
                cy.contains(`Birthdate: ${newBirthdate}`).should('exist');
                cy.contains(`Course: ${newCourse}`).should('exist');
                cy.contains('Edit').should('exist');
                cy.wait(2000);
            });
    });

    it('searches for a user, displays user profile, user posts', () => {
        // Visit the page or component
        cy.visit('http://aws2302.atrous.de/newsfeed');

        // Assertions for initial user profile information
        cy.get('.appnewsfeed .header')
            .should('exist')
            .within(() => {
                cy.get('.logo').should('exist');
                cy.get('.search-bar-input').should('exist');
                cy.get('button').contains('Search').should('exist');
                cy.get('.user-info-container').should('exist');
                cy.get('.user-photo img').should('exist');
                cy.get('.user-details .menu-item').contains(user.RealName).should('exist');
                cy.get('.dropdown-content a.menu-item').contains('Profile').should('exist');
                cy.get('.dropdown-content a.menu-item').contains('Logout').should('exist');
            });

        // Interact with the search bar
        cy.get('.search-bar-input').type('Ramzi Atrous');
        cy.get('button').contains('Search').click();
        cy.get('.search-liste ul li').should('have.length.greaterThan', 0);
        cy.get('.search-liste ul li').first().click();

        // Assert that the user's name is displayed on the profile page
        cy.url().should('include', '/profil/');  // Assuming the URL changes when navigating to the profile page

        //cy.get('.appnewsfeed').contains('Marco Ruzzo').should('exist');
        cy.get('.appprofile .sidebar')
            .should('exist')
            .within(() => {
                cy.get('.logos').should('exist');
                cy.contains('Name:').should('exist');
                cy.contains('Birthdate:').should('exist');
                cy.contains('Course:').should('exist');
                cy.wait(2000);
            });
    });

    it('allows user to type a message, upload an image, send a message, delete a post', () => {
        cy.visit('http://aws2302.atrous.de/newsfeed');
        // Type a message in the textarea
        const messageText = 'This is a test message!';
        cy.get('.input-container textarea').type(messageText);

        // Upload an image (assuming you have a sample image file in your project)
        const imagePath = '/images/aws-logo.jpg';
        cy.get('.input-container input[type="file"]').attachFile(imagePath);

        // Click the "Send" button
        cy.get('.input-container .send-button').click();

        // Check if the message and image are displayed in the chat.
        cy.get('.postimg').should('exist');
        cy.get('.post-media').should('exist');

        // Wait for the page to load and posts to be visible
        cy.get('.message').should('exist');

        // Check for delete button and click it (assuming delete button is available)
        //cy.get('.delete').click();
        cy.reload();
        cy.get('.message').eq(0).find('.delete').click();
    });
    it('logs out of the application', () => {
        cy.visit('http://aws2302.atrous.de/newsfeed');
        // Click the "Logout" button
        cy.contains('Ambika Angadi', { timeout: 10000 }).should('be.visible').invoke('addClass', 'menu-item').click();
        cy.get('.dropdown-content a.menu-item').contains('Profile').should('exist');
        cy.get('.dropdown-content a.menu-item').contains('Logout').should('exist');
        cy.contains('Logout', { timeout: 10000 }).should('exist').click({ force: true });
        // Assert if redirected to the homepage
        cy.url().should('eq', 'http://aws2302.atrous.de/');
    });
});



describe("publisher-004-05 : Verify authorized user can add security to the endpoint", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const apiVersion = Math.floor(Date.now() / 100000);
    const apiName = `sample_api_${apiVersion}`;

    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })

    it.only("Authorized user adds endpoint security for the API", () => {
        const endpoint = 'https://petstore.swagger.io/v2/store/inventory';
        const usernameLocal = 'admin';
        const passwordLocal = 'admin';
        cy.loginToPublisher(publisher, password);
        cy.wait(2000);
        cy.createAPIWithoutEndpoint(apiName, "REST", apiVersion);
        cy.get('[data-testid="left-menu-itemendpoints"]').click();
        cy.get('[data-testid="http__rest_endpoint-start"]').click();

        // Add the prod and sandbox endpoints
        cy.get('[data-testid="production-endpoint-checkbox"]').click();
        cy.get('#primaryEndpoint').focus().type(endpoint);


        cy.get('[data-testid="primaryEndpoint-endpoint-security-icon-btn"]').trigger('click');
        cy.wait(2000);
        // cy.get('body').click();
        cy.get('[data-testid="auth-type-select"]').click();
        cy.wait(2000);
        cy.get('[data-testid="auth-type-BASIC"]').click();
        cy.get('#auth-userName').click();
        cy.get('#auth-userName').type(usernameLocal);
        cy.get('#auth-password').click();
        cy.get('#auth-password').type(passwordLocal);

        // Save the security form
        cy.get('[data-testid="endpoint-security-submit-btn"]').click();

        // Save the endpoint
        cy.get('[data-testid="endpoint-save-btn"]').click();
        cy.wait(3000);

        // Check the values
        cy.get('[data-testid="primaryEndpoint-endpoint-security-icon-btn"]').trigger('click');
        cy.get('#auth-userName').should('have.value', usernameLocal);


    });

    after(function () {
        // Test is done. Now delete the api
        cy.deleteApi(apiName, `v${apiVersion}`);

        //cy.visit('carbon/user/user-mgt.jsp');
       // cy.deleteUser(publisher);
    })
});

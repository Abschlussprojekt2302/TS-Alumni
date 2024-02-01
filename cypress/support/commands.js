// cypress/support/commands.js
Cypress.Commands.add('loginByGoogleApi', () => {
  cy.log('Logging in to Google')
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { access_token, id_token } = body

    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      cy.log(body)
      const userItem = {
        accessToken: access_token,
        user: {
          name: body.name,
          sub: body.sub,
          email: body.email,
          given_name: body.given_name,
          family_name: body.family_name,
          picture: body.picture,
        },
      }

      cy.request({
        method: 'POST',
        url: 'https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/login/google',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userItem)
      }).then(({ body }) => {
        cy.log(body)
        localStorage.setItem("Session", body.sessionData);
        let x = JSON.parse(body.steps.existingUserMessage);
        localStorage.setItem("UserID", x[0].UserID);
      })
    })
  })
})
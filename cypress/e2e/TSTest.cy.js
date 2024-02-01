describe('Google', function () {
    beforeEach(function () {
      cy.loginByGoogleApi()
    })
  
    it('shows onboarding', function () {
      cy.visit('http://aws2302.atrous.de/newacc');
      // cy.contains('Gt Started').sehould('be.visible')
    })   


    it('shows newfeed ', function () {
      cy.visit('http://aws2302.atrous.de/newsfeed');
      // cy.contains('Gt Started').sehould('be.visible')
    })   


  })
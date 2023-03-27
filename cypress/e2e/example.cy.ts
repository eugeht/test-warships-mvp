// https://docs.cypress.io/api/introduction/api.html

export default function() {
  describe( 'Page loads', () => {
    it( 'visits the app root url', () => {
      cy.visit( '/' )
      cy.find( '.the-header' )
    } )
  } )
}

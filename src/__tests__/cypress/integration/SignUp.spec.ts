describe('SignIn', () => {
  it('should correct initial state', () => {
    cy.visit('/signup');
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', '#c53030')
      .should('have.length', '3');
  });
});

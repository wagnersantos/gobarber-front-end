describe('ForgotPassword', () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
  });

  it('should correct initial state', () => {
    cy.visit('/forgot-password');
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', 'rgb(197, 48, 48)')
      .should('have.length', '1');
  });
});

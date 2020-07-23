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

  it('should present error if submit empty values', () => {
    cy.visit('/forgot-password');
    cy.get('button').click();
    cy.getByTestId('input-container')
      .first()
      .should('have.css', 'border-color', 'rgb(197, 48, 48)')
      .children()
      .should('have.length', '3');
  });
});

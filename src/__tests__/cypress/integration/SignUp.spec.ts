describe('SignIn', () => {
  it('should correct initial state', () => {
    cy.visit('/signup');
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', '#c53030')
      .should('have.length', '3');
  });

  it('should present error if submit empty values', () => {
    cy.get('button').click();
    cy.getByTestId('input-container')
      .first()
      .should('have.css', 'border-color', 'rgb(197, 48, 48)')
      .children()
      .should('have.length', '3');

    cy.getByTestId('input-container')
      .last()
      .should('have.css', 'border-color', 'rgb(197, 48, 48)')
      .children()
      .should('have.length', '3');
  });
});

import faker from 'faker';

describe('SignIn', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should correct initial state', () => {
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

  it('should present error if form is invalid', () => {
    cy.get('input[placeholder="Nome"]').type(faker.random.word());
    cy.get('input[placeholder="E-mail"]').type(faker.random.word());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(3));
    cy.get('button').click();
    cy.get('input[placeholder="E-mail"]')
      .parent()
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

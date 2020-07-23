import faker from 'faker';

const { baseUrl } = Cypress.config();

describe('ForgotPassword', () => {
  beforeEach(() => {
    cy.server();
    cy.viewport(1024, 768);
    cy.visit('/forgot-password');
  });

  it('should correct initial state', () => {
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', 'rgb(197, 48, 48)')
      .should('have.length', '1');
  });

  it('should present error if submit empty values', () => {
    cy.get('button').click();
    cy.getByTestId('input-container')
      .first()
      .should('have.css', 'border-color', 'rgb(197, 48, 48)')
      .children()
      .should('have.length', '3');
  });

  it('should present error if form is invalid', () => {
    cy.get('input[placeholder="E-mail"]').type(faker.random.word());
    cy.get('button').click();
    cy.getByTestId('input-container')
      .first()
      .should('have.css', 'border-color', 'rgb(197, 48, 48)')
      .children()
      .should('have.length', '3');
  });

  it('should present valid state if form is valid', () => {
    cy.get('input[placeholder="E-mail"]')
      .type(faker.internet.email())
      .parent()
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
  });

  it('should present should present message if happened unexpectedError', () => {
    cy.route({
      method: 'POST',
      url: /forgot-password/,
      status: faker.helpers.randomize([400, 401, 404, 500]),
      response: {
        error: faker.random.words(),
      },
    }).as('request');
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('button').click();
    cy.getByTestId('toast-container')
      .children()
      .should('have.attr', 'type', 'error')
      .should('contain.text', 'Erro na recuperação de senha')
      .should(
        'contain.text',
        'Ocorreu um erro ao tentar recuperar a senha, tente novamente',
      );
  });

  it('should forgotPassword if valid email is provided', () => {
    cy.route({
      method: 'POST',
      url: /forgot-password/,
      status: 204,
      response: faker.random.words(),
    }).as('request');
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('button').click();
    cy.getByTestId('toast-container')
      .children()
      .should('have.attr', 'type', 'success')
      .should('contain.text', 'E-mail de recuperação enviado')
      .should(
        'contain.text',
        'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
      );
  });
});

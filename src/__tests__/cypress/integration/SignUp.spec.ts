import faker from 'faker';

const { baseUrl } = Cypress.config();

describe('SignUp', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/signup');
    cy.viewport(1024, 768);
  });

  it('should correct initial state', () => {
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', 'rgb(197, 48, 48)')
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

  it('should present valid state if form is valid', () => {
    cy.get('input[placeholder="Nome"]')
      .type(faker.random.word())
      .parent()
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
    cy.get('input[placeholder="E-mail"]')
      .type(faker.internet.email())
      .parent()
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
    cy.get('input[placeholder="Senha"]')
      .type(faker.random.alphaNumeric(6))
      .parent()
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
    cy.get('button').focus();
    cy.getByTestId('input-container')
      .first()
      .should('not.have.css', 'border-color', 'rgb(255, 144, 0)')
      .children('svg')
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
    cy.getByTestId('input-container')
      .last()
      .should('not.have.css', 'border-color', 'rgb(255, 144, 0)')
      .children('svg')
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
  });

  it('should present message if happened unexpectedError', () => {
    cy.route({
      method: 'POST',
      url: /users/,
      status: faker.helpers.randomize([400, 403, 404, 500]),
      response: {
        error: faker.random.words(),
      },
    }).as('request');
    cy.get('input[placeholder="Nome"]').type(faker.random.word());
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(6));
    cy.get('button').click();
    cy.getByTestId('toast-container')
      .children()
      .should('have.attr', 'type', 'error')
      .should('contain.text', 'Erro no cadastro')
      .should(
        'contain.text',
        'Ocorreu um erro ao fazer cadastro, tente novamente',
      );
  });

  it('should create account and navigate to signin if valid data are provided', () => {
    cy.route({
      method: 'POST',
      url: /users/,
      status: 204,
      response: faker.random.words(),
    }).as('request');
    cy.get('input[placeholder="Nome"]').type(faker.random.word());
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(6));
    cy.get('button').click();
    cy.url().should('eq', `${baseUrl}/`);
    cy.getByTestId('toast-container')
      .children()
      .should('have.attr', 'type', 'success')
      .should('contain.text', 'Cadastro realizado com sucesso')
      .should('contain.text', 'Você já pode fazer seu logon no GoBarber');
  });

  it('should prevent multiple submits', () => {
    cy.route({
      method: 'POST',
      url: /users/,
      status: 204,
      response: faker.random.words(),
    }).as('request');
    cy.get('input[placeholder="Nome"]').type(faker.random.word());
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(6));
    cy.get('button').dblclick();
    cy.wait('@request');
    cy.get('@request.all').should('have.length', 1);
  });

  it('should not call submit if form is invalid', () => {
    cy.route({
      method: 'POST',
      url: /users/,
      status: 204,
      response: faker.random.words(),
    }).as('request');
    cy.get('input[placeholder="E-mail"]')
      .type(faker.internet.email())
      .type('{enter}');
    cy.get('@request.all').should('have.length', 0);
  });

  it('should back to signin ', () => {
    cy.get('a[href="/"]').click();
    cy.url().should('eq', `${baseUrl}/`);
  });
});

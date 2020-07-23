import faker from 'faker';

const { baseUrl } = Cypress.config();

describe('SignIn', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('');
    cy.viewport(1024, 768);
  });

  it('should correct initial state', () => {
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', 'rgb(197, 48, 48)')
      .should('have.length', '2');
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
    cy.get('input[placeholder="E-mail"]').type(faker.random.word());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(3));
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

  it('should present should present message if happened unexpectedError', () => {
    cy.route({
      method: 'POST',
      url: /sessions/,
      status: faker.helpers.randomize([400, 401, 404, 500]),
      response: {
        error: faker.random.words(),
      },
    }).as('request');
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(6));
    cy.get('button').click();
    cy.getByTestId('toast-container')
      .children()
      .should('have.attr', 'type', 'error')
      .should('contain.text', 'Erro na autenticação')
      .should(
        'contain.text',
        'Ocorreu um erro ao fazer login, cheque as credenciais',
      );
  });

  it('should present save token if valid credentials are provided', () => {
    cy.route({
      method: 'POST',
      url: /sessions/,
      status: 200,
      response: {
        token: faker.random.uuid(),
        user: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          avatar_url: faker.internet.url(),
        },
      },
    }).as('request');
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(6));
    cy.get('button').click();
    cy.url().should('eq', `${baseUrl}/dashboard`);
    cy.window().then(window => {
      assert.isOk(window.localStorage.getItem('@GoBarber:token'));
      assert.isOk(window.localStorage.getItem('@GoBarber:user'));
    });
  });

  it('should prevent multiple submits', () => {
    cy.route({
      method: 'POST',
      url: /sessions/,
      status: 200,
      response: {
        token: faker.random.uuid(),
        user: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          avatar_url: faker.internet.url(),
        },
      },
    }).as('request');
    cy.get('input[placeholder="E-mail"]').type(faker.internet.email());
    cy.get('input[placeholder="Senha"]').type(faker.random.alphaNumeric(6));
    cy.get('button').dblclick();
    cy.wait('@request');
    cy.get('@request.all').should('have.length', 1);
  });

  it('should not call submit if form is invalid', () => {
    cy.route({
      method: 'POST',
      url: /sessions/,
      status: 200,
      response: {
        token: faker.random.uuid(),
        user: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          avatar_url: faker.internet.url(),
        },
      },
    }).as('request');
    cy.get('input[placeholder="E-mail"]')
      .type(faker.internet.email())
      .type('{enter}');
    cy.get('@request.all').should('have.length', 0);
  });

  it('should navigate to create account', () => {
    cy.get('a[href="/signup"]').click();
    cy.url().should('eq', `${baseUrl}/signup`);
  });

  it('should navigate to forgot password', () => {
    cy.get('a[href="/forgot-password"]').click();
    cy.url().should('eq', `${baseUrl}/forgot-password`);
  });
});

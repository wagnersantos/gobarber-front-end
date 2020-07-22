describe('SignIn', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should correct initial state', () => {
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', '#c53030')
      .should('have.length', '2');
  });

  it('should present error if submit empty values', () => {
    cy.get('input[placeholder="E-mail"]');
    cy.get('input[placeholder="Senha"]');
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
    cy.get('input[placeholder="E-mail"]').type('invalid-email');
    cy.get('input[placeholder="Senha"]').type('123');
    cy.get('button').click();
    cy.getByTestId('input-container')
      .first()
      .should('have.css', 'border-color', 'rgb(197, 48, 48)')
      .children()
      .should('have.length', '3');
  });

  it('should present valid state if form is valid', () => {
    cy.get('input[placeholder="E-mail"]')
      .type('test@test.com')
      .parent()
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
    cy.get('input[placeholder="Senha"]')
      .type('123456')
      .parent()
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
    cy.get('button').focus();
    cy.getByTestId('input-container')
      .should('not.have.css', 'border-color', 'rgb(255, 144, 0)')
      .children('svg')
      .should('have.css', 'border-color', 'rgb(255, 144, 0)');
  });

  it('should present invalidCredentialsError on 401', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: /sessions/,
      status: 401,
      response: {
        error: 'Credenciais inválidas',
      },
    }).as('request');
    cy.get('input[placeholder="E-mail"]').type('test@test.com');
    cy.get('input[placeholder="Senha"]').type('123456');
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
});

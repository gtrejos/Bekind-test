describe('1. AUTENTICACIÓN - Login', () => {
  
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/', { timeout: 10000 })
    cy.get('form', { timeout: 10000 }).should('exist')
    cy.wait(2000)
  })

 it('1.1 - Login exitoso con credenciales válidas', () => {
  cy.get('input[type="email"]').should('be.visible')
  cy.get('input[type="password"]').should('be.visible')
  

  cy.get('input[type="email"]').clear().type('a.berrio@yopmail.com')
  cy.get('input[type="password"]').clear().type('AmuFK8G4Bh64Q1uX+IxQhw==')
  
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard', { timeout: 15000 })
  
  cy.window().then((win) => {
    const storage = win.localStorage.getItem('bekind-auth')
    expect(storage).to.exist
    const parsed = JSON.parse(storage)
    expect(parsed.state.token).to.exist
    expect(parsed.state.isAuthenticated).to.be.true
  })
  
  cy.log('✅ Test 1.1 Pass: Login exitoso')
})

  it('1.2 - Login fallido con credenciales inválidas', () => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Objects are not valid as a React child')) {
        return false
      }
      return true
    })
    
    cy.get('input[type="email"]').clear().type('invalid@test.com')
    cy.get('input[type="password"]').clear().type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/dashboard')
    cy.get('button[type="submit"]', { timeout: 5000 }).should('contain', 'Ingresar')
    cy.log('✅ Test 1.2 Pass: Login falló correctamente')
  })

  it('1.3 - Validación de email inválido', () => {
  cy.get('input[type="email"]').clear().type('notanemail')
  cy.get('input[type="password"]').clear().type('password123')
  cy.get('button[type="submit"]').click()
  
  cy.wait(2000)
  cy.url().should('not.include', '/dashboard')
  
  cy.get('form').should('be.visible')
  
  cy.log('✅ Test 1.3 Pass: Email inválido no permite login')
})

  it('1.4 - Validación de contraseña requerida', () => {
    cy.get('input[type="email"]').clear().type('a.berrio@yopmail.com')
    cy.get('input[type="password"]').clear()
    cy.get('button[type="submit"]').click()
    cy.contains('La contraseña es requerida', { timeout: 5000 }).should('be.visible')
    
    cy.log('✅ Test 1.4 Pass: Validación de contraseña')
  })

  it('1.5 - Toggle mostrar/ocultar contraseña', () => {
    cy.get('input[type="password"]').as('passwordInput')
    cy.get('@passwordInput').should('have.attr', 'type', 'password')
    cy.get('button.password-toggle').click()
    cy.get('input[type="text"]').should('exist')
    cy.get('button.password-toggle').click()
    cy.get('input[type="password"]').should('exist')
    cy.log('✅ Test 1.5 Pass: Toggle funciona')
  })
})
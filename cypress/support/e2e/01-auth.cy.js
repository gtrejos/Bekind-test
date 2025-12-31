describe('1. AUTENTICACIÓN - Login', () => {
  
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/')
  })

  it('1.1 - Login exitoso con credenciales válidas', () => {
    cy.get('input[type="email"]').type('a.berrio@yopmail.com')
    cy.get('input[type="password"]').type('AmuFK8G4Bh64Q1uX+IxQhw==')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Ingresando...').should('be.visible')
    cy.url().should('include', '/dashboard', { timeout: 10000 })
    
    cy.window().then((win) => {
      const storage = win.localStorage.getItem('auth-storage')
      expect(storage).to.exist
    })
    
    cy.log('✅ Test 1.1 Pass: Login exitoso')
  })

  it('1.2 - Login fallido con credenciales inválidas', () => {
    cy.get('input[type="email"]').type('invalid@test.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    
    cy.get('.login-error', { timeout: 5000 }).should('be.visible')
    cy.url().should('match', /login|^\/$/)
    
    cy.log('✅ Test 1.2 Pass: Error mostrado correctamente')
  })

  it('1.3 - Validación de email inválido', () => {
    cy.get('input[type="email"]').type('notanemail')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Correo inválido').should('be.visible')
    cy.log('✅ Test 1.3 Pass: Validación de email')
  })

  it('1.4 - Validación de contraseña requerida', () => {
    cy.get('input[type="email"]').type('a.berrio@yopmail.com')
    cy.get('button[type="submit"]').click()
    
    cy.contains('La contraseña es requerida').should('be.visible')
    cy.log('✅ Test 1.4 Pass: Validación de contraseña')
  })
})
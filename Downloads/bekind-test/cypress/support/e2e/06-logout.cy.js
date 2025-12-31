describe('6. CERRAR SESIÓN', () => {
  
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/')
    cy.get('input[type="email"]').type('a.berrio@yopmail.com')
    cy.get('input[type="password"]').type('AmuFK8G4Bh64Q1uX+IxQhw==')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard', { timeout: 10000 })
    cy.wait(2000)
  })

  it('6.1 - Cerrar sesión correctamente', () => {
    cy.get('.user-profile-button').click()
    cy.get('.user-dropdown-menu').should('be.visible')
    cy.contains('Cerrar sesión').click()
    
    cy.url().should('match', /login|^\/$/)
    
    cy.window().then((win) => {
      const storage = win.localStorage.getItem('auth-storage')
      const parsed = storage ? JSON.parse(storage) : null
      expect(parsed?.state?.token).to.be.null
    })
    
    cy.log(' Test 6.1 Pass: Logout exitoso')
  })
})
describe('4. CREAR ACCIÓN', () => {
  
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

  it('4.1 - Abrir modal de creación', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-container').should('be.visible')
    cy.contains('Crear categoría').should('be.visible')
    
    cy.log(' Test 4.1 Pass: Modal se abre')
  })

  it('4.2 - Cerrar modal sin guardar', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-close').click()
    cy.get('.modal-container').should('not.exist')
    
    cy.log(' Test 4.2 Pass: Modal se cierra')
  })

  it('4.3 - Validación de campo nombre requerido', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('button[type="submit"]').contains('Crear').click()
    cy.contains('Mínimo 3 caracteres').should('be.visible')
    
    cy.log(' Test 4.3 Pass: Validación de nombre')
  })

  it('4.4 - Validación de descripción', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('input[placeholder*="nombre"]').type('Test')
    cy.get('textarea[placeholder*="descripción"]').type('Corto')
    cy.get('button[type="submit"]').contains('Crear').click()
    cy.contains('Mínimo 10 caracteres').should('be.visible')
    
    cy.log(' Test 4.4 Pass: Validación de descripción')
  })

  it('4.5 - Contador de caracteres funciona', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    const testText = 'Esta es una descripción de prueba'
    cy.get('textarea[placeholder*="descripción"]').type(testText)
    cy.get('.char-count').should('contain', `${testText.length}/200`)
    
    cy.log(' Test 4.5 Pass: Contador funciona')
  })

  it('4.6 - Toggle activo/inactivo funciona', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.toggle-switch').click()
    cy.get('.toggle-switch').should('not.have.class', 'active')
    cy.get('.toggle-switch').click()
    cy.get('.toggle-switch').should('have.class', 'active')
    
    cy.log(' Test 4.6 Pass: Toggle funciona')
  })
})
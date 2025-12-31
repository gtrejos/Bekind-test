describe('4. CREAR ACCIÓN', () => {
  
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/', { timeout: 10000 })
    cy.get('form', { timeout: 10000 }).should('exist')
    cy.wait(1000)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard', { timeout: 20000 })
    cy.get('.dashboard-table', { timeout: 10000 }).should('be.visible')
    cy.wait(2000)
  })

  it('4.1 - Abrir modal de creación', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-overlay', { timeout: 5000 }).should('be.visible')
    cy.contains('Crear categoría').should('be.visible')
    
    cy.log('✅ Test 4.1 Pass: Modal se abre')
  })

  it('4.2 - Cerrar modal sin guardar', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-overlay', { timeout: 5000 }).should('be.visible')
    cy.get('.modal-overlay').click('topLeft')
    cy.get('.modal-overlay').should('not.exist')
    
    cy.log('✅ Test 4.2 Pass: Modal se cierra')
  })

  it('4.3 - Validación de campo nombre requerido', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-overlay', { timeout: 5000 }).should('be.visible')
    cy.get('button[type="submit"]').click()
    cy.contains('Mínimo 3 caracteres').should('be.visible')
    
    cy.log('✅ Test 4.3 Pass: Validación de nombre')
  })

  it('4.4 - Validación de descripción', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-overlay', { timeout: 5000 }).should('be.visible')
    cy.get('input[name="name"]').type('Test Categoria')
    cy.get('textarea[name="description"]').type('Corto')
    cy.get('button[type="submit"]').click()
    cy.contains('Mínimo 10 caracteres').should('be.visible')
    
    cy.log('✅ Test 4.4 Pass: Validación de descripción')
  })

  it('4.5 - Contador de caracteres funciona', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-overlay', { timeout: 5000 }).should('be.visible')
    
    const testText = 'Esta es una descripción de prueba'
    cy.get('textarea[name="description"]').type(testText)
    cy.contains(new RegExp(`${testText.length}/200`)).should('be.visible')
    
    cy.log('✅ Test 4.5 Pass: Contador funciona')
  })

  it('4.6 - Toggle activo/inactivo funciona', () => {
    cy.contains('button', 'Crear tipo de categoría').click()
    cy.get('.modal-overlay', { timeout: 5000 }).should('be.visible')
    
    cy.get('.toggle-switch').should('have.class', 'active')
    cy.get('.toggle-switch').click()
    cy.get('.toggle-switch').should('not.have.class', 'active')
    cy.get('.toggle-switch').click()
    cy.get('.toggle-switch').should('have.class', 'active')
    
    cy.log('✅ Test 4.6 Pass: Toggle funciona')
  })
})
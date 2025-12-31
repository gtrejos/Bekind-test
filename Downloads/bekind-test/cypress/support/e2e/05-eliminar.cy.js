describe('5. ELIMINAR ACCIÓN', () => {
  
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

  it('5.1 - Abrir modal de confirmación', () => {
    cy.get('.action-btn.delete').first().click()
    cy.get('.confirm-dialog-container').should('be.visible')
    cy.contains('¿Eliminar categoría?').should('be.visible')
    
    cy.log(' Test 5.1 Pass: Modal de confirmación se abre')
  })

  it('5.2 - Cancelar eliminación', () => {
    cy.get('.action-btn.delete').first().click()
    cy.contains('button', 'Cancelar').click()
    cy.get('.confirm-dialog-container').should('not.exist')
    
    cy.log(' Test 5.2 Pass: Cancelación funciona')
  })
})
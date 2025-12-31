describe('2. DASHBOARD - Listado', () => {
  
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/', { timeout: 10000 })
    cy.get('form', { timeout: 10000 }).should('exist')
    cy.wait(1000)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard', { timeout: 20000 })
    cy.wait(3000)
  })

  it('2.1 - Carga inicial del listado', () => {
    cy.get('.dashboard-table', { timeout: 10000 }).should('be.visible')
    cy.contains('th', 'Nombre de la categoría').should('be.visible')
    cy.contains('th', 'Estado').should('be.visible')
    cy.contains('th', 'Acciones').should('be.visible')
    
    cy.log('✅ Test 2.1 Pass: Listado carga correctamente')
  })

  it('2.2 - Mostrar loader durante la carga', () => {
    cy.reload()
    
    cy.get('.loading-spinner', { timeout: 5000 }).should('be.visible')
    cy.contains('Cargando acciones...').should('be.visible')
    cy.get('.loading-spinner', { timeout: 15000 }).should('not.exist')
    
    cy.log('✅ Test 2.2 Pass: Loader funciona')
  })

  it('2.3 - Visualización de datos en la tabla', () => {
    cy.get('.dashboard-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    
    cy.get('.dashboard-table tbody tr').first().within(() => {
      cy.get('td').first().should('not.be.empty')
      cy.contains('.status-badge', 'Activo').should('be.visible')
      cy.get('.action-btn.edit').should('be.visible')
      cy.get('.action-btn.delete').should('be.visible')
    })
    
    cy.log('✅ Test 2.3 Pass: Datos se muestran correctamente')
  })

  it('2.4 - Contador de resultados', () => {
    cy.contains(/\d+ - \d+ de \d+/).should('be.visible')
    cy.log('✅ Test 2.4 Pass: Contador visible')
  })
})
describe('3. PAGINACIÓN', () => {
  
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

  it('3.1 - Navegación a página siguiente', () => {
    cy.get('.pagination-info').invoke('text').then((text1) => {
      cy.get('.pagination-btn[title="Página siguiente"]').click()
      cy.wait(2000)
      cy.get('.pagination-info').invoke('text').should('not.equal', text1)
    })
    
    cy.log('✅ Test 3.1 Pass: Navegación a siguiente página')
  })

  it('3.2 - Navegación a página anterior', () => {
    cy.get('.pagination-btn[title="Página siguiente"]').click()
    cy.wait(2000)
    cy.get('.pagination-btn[title="Página anterior"]').click()
    cy.wait(2000)
    cy.get('.pagination-info').should('contain', '1 - ')
    
    cy.log('✅ Test 3.2 Pass: Navegación a anterior')
  })

  it('3.3 - Botones deshabilitados en primera página', () => {
    cy.get('.pagination-btn[title="Primera página"]').then(($btn) => {
      if (!$btn.is(':disabled')) {
        cy.get('.pagination-btn[title="Primera página"]').click()
        cy.wait(2000)
      }
    })
    
    cy.get('.pagination-btn[title="Primera página"]').should('be.disabled')
    cy.get('.pagination-btn[title="Página anterior"]').should('be.disabled')
    
    cy.log('✅ Test 3.3 Pass: Botones deshabilitados correctamente')
  })


})
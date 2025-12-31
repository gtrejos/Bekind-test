describe('3. PAGINACIÓN', () => {
  
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

  it('3.1 - Navegación a página siguiente', () => {
    cy.get('.pagination-info').invoke('text').then((text1) => {
      cy.get('.pagination-btn[title="Página siguiente"]').click()
      cy.wait(1000)
      cy.get('.pagination-info').invoke('text').should('not.equal', text1)
    })
    
    cy.log('Test 3.1 Pass: Navegación a siguiente página')
  })

  it('3.2 - Navegación a página anterior', () => {
    cy.get('.pagination-btn[title="Página siguiente"]').click()
    cy.wait(1000)
    cy.get('.pagination-btn[title="Página anterior"]').click()
    cy.wait(1000)
    cy.contains(/1 - \d+ de/).should('be.visible')
    
    cy.log(' Test 3.2 Pass: Navegación a anterior')
  })

  it('3.3 - Botones deshabilitados en primera página', () => {
    cy.get('.pagination-btn[title="Primera página"]').should('be.disabled')
    cy.get('.pagination-btn[title="Página anterior"]').should('be.disabled')
    
    cy.log(' Test 3.3 Pass: Botones deshabilitados correctamente')
  })

  it('3.4 - Actualización del contador de resultados', () => {
    cy.get('.pagination-info').should('contain', '1 - 10 de')
    cy.get('.pagination-btn[title="Página siguiente"]').click()
    cy.wait(1000)
    cy.get('.pagination-info').should('contain', '11 - 20 de')
    
    cy.log(' Test 3.4 Pass: Contador actualiza correctamente')
  })
})
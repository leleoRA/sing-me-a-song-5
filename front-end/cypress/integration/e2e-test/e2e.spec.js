/// <reference types="cypress" />

describe('recommendation e2e', () => {
  beforeEach(() => {
    cy.resetDatabase()
  })
  it('should create a new recommendation and list it', () => {
    cy.intercept('GET', '/recommendations').as('getRecommendations')
    cy.intercept('POST', '/recommendations').as('postRecommendation')
    cy.visit('http://localhost:3000')
    cy.get('#name').type('final countdown')
    cy.get('#link').type('https://www.youtube.com/watch?v=9jK-NcRmVcw')
    cy.get('#send').click()
    cy.wait('@postRecommendation')
    cy.wait('@getRecommendations')
    cy.get('article').should(($article) => {
      expect($article).to.have.length(1)
    })
    cy.url().should('equal', 'http://localhost:3000/')
  })

  it('should see the top recommendation', () => {
    cy.visit('http://localhost:3000/top')
    cy.intercept('GET', '/recommendations/top/10').as('getTopRecommendations')
    for (let i = 0; i < 10; i++) {
      cy.createRecommendation()
    }

    cy.wait('@getTopRecommendations')
    cy.get('article').should(($article) => {
      expect($article).to.have.length(10)
    })
  })
})

/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

const {faker} = require('@faker-js/faker');

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('quantidade')
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    const newUser = {
      nome: faker.person.firstName(),
      email: faker.internet.email(),
      password: "teste",
      administrador: "true"
    };
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: newUser
    })
      .then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      });
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        nome: "Fulano da Silva",
        email: "beltrano@qa.com.br",
        password: "teste",
        administrador: "true"
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('message', 'Este email já está sendo usado')
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let usuario = `hellen${Math.floor(Math.random() * 100000000)}@qa.com.br`
    cy.cadastrarUsuario('hellen', usuario, 'teste', 'true')
    .then(response => {
      let id = response.body._id
      cy.request({
          method: 'PUT', 
          url: `usuarios/${id}`, 
          body: {
              nome: faker.person.firstName(),
              email: faker.internet.email(),
              password: "teste",
              administrador: "true"
            }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let usuario = `hellen${Math.floor(Math.random() * 100000000)}@qa.com.br`
    cy.cadastrarUsuario('hellen', usuario, 'teste', 'true')
    .then(response => {
      let id = response.body._id
      cy.request({
          method: 'DELETE', 
          url: `usuarios/${id}`,
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    }) 
  });


})

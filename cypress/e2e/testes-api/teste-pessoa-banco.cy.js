const url = "http://localhost:8443/editoralivros"

describe("Consultar, criar, editar e deletar Pessoa", () => {
    const urlPessoa = url + "/pessoa"
    const pessoaNova = {
        cpf: 126,
        nome: "Otavio",
        sobrenome: "Augusto",
        email: "otavio.A@gmail.com",
        senha: "123",
        genero: "MASCULINO"
    }
    let quantidadePessoa = 0

    //pega o valor do tamanho da lista
    it('consultar pessoas do banco', () => {
        cy.request("GET", urlPessoa).as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            quantidadePessoa = response.body.length
            expect(response.body[0]).to.have.property('cpf')
        })
    })
    
    it('consultar pessoa por email', () => {
        cy.request("GET", urlPessoa + "/email/joao@gmail.com").as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.have.property('cpf', 123)
        })
    })

    it('consultar pessoa por email que não existe', () => {
        cy.request("GET", urlPessoa + "/email/dasfbdsfvb@gmail.com").as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.eq("Não foi encontrada nenhuma pessoa com este e-mail")
        })
    })

    it('consultar pessoa por cpf', () => {
        cy.request("GET", urlPessoa + "/cpf/123").as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.have.property('email', "joao@gmail.com")
        })
    })

    it('consultar pessoa por cpf que não existe', () => {
        cy.request("GET", urlPessoa + "/cpf/1355").as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.eq("Não foi encontrada nenhuma pessoa com este CPF")
        })
    })

    it('cadastrar pessoa nova', () => {
        cy.request("POST", urlPessoa + "/1", pessoaNova).as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.have.property('cpf', 126)
        })
    })

    it('cadastrar pessoa que tem um cpf que já existe no banco', () => {
        cy.request("POST", urlPessoa + "/1", pessoaNova).as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.eq("Este CPF já está cadastrado")
        })
    })

    it('cadastrar pessoa que tem um email que já existe no banco', () => {
        pessoaNova.cpf = 127

        cy.request("POST", urlPessoa + "/1", pessoaNova).as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.eq("Este email já está cadastrado")
        })
    })

    it('atualizar pessoa', () => {
        pessoaNova.cpf = 126
        pessoaNova.genero = "OUTRO"

        cy.request("PUT", urlPessoa + "/126", pessoaNova).as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.have.property('genero', "OUTRO")
        })
    })

    it('atualizar pessoa que não existe', () => {
        cy.request("PUT", urlPessoa + "/1299", pessoaNova).as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.eq("Não foi encontrada nenhuma pessoa com este CPF")
        })
    })

    //uso prA VERIFICAR O TAMANHO
    it('deletar pessoa', () => {
        cy.request("DELETE", urlPessoa + "/126").as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.eq("Pessoa deletada")
        })

        cy.request("GET", urlPessoa).as("SecondaryRequest")
        cy.get("@SecondaryRequest").then(response => {
            expect(response.body.length).to.eq(quantidadePessoa)
        })
    })

    it('deletar pessoa que não existe', () => {
        cy.request("DELETE", urlPessoa + "/12600").as("TodoRequest")
        cy.get("@TodoRequest").then(response => {
            expect(response.body).to.eq("Não foi encontrada nenhuma pessoa com este CPF")
        })
    })
})
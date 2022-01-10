//importando os modulos express e mongoose
var express = require("express")
var mongoose = require("mongoose") //ferramenta para realizar a modelagem do DB


const app = express() //criando uma aplicacao do express
const port = 3000 //criando uma porta

//conexao com o DB, com o uso de flags para tratamentos de erros e depreciacao do codigo
mongoose.connect("mongodb+srv://mateus_machado:mateus_machado@cluster0.nobsl.mongodb.net/vendas?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//criando um modelo que irá compor a collection do DB
const Produtos = mongoose.model("Produtos", {
  nome: String,
  valUni: Number,
  codBarras: String
})

//chamando o motor de visualização
app.set("view engine", "ejs")
app.set("views", __dirname, "/views")


app.use(express.urlencoded({
  extended: true
})) //permitindo que tenha fluxo de dados entre as paginas
app.use(express.json()) // definindo que os arquivos serao transportados em formato json


//criando rota principal
app.get("/", (req, res) => { // app get para pegar o caminho local seguido de callback
  res.send("Página inicial") // resposta na pagina 
})


//criando uma rota para listar os produtos cadastrados
app.get("/produtos", (req, res) => { //rota para pag produtos
  Produtos.find({}, (err, produto) => { //find{pega tudo}
    if (err)
      return res.status(500).send("Erro ao consultar Produto")

    res.render("produtos", {
      item: produto
    }) //renderizar pag produtos
  })
})

// rota para renderizar a pagina de formulario do cadastro
app.get("/cadastrarProdutos", (req, res) => {
  res.render("formprodutos")
})


//metodo POST para salvar os produtos no DB 
app.post("/cadastrarProdutos", (req, res) => {
  let produto = new Produtos() //criando um objeto do tipo produtos

  produto.nome = req.body.nome //recebe os dados atraves da tag name
  produto.valUni = req.body.valor //recebe os dados atraves da tag name
  produto.codBarras = req.body.codBar //recebe os dados atraves da tag name

  produto.save(err => { //condicao para verificar erro
    if (err) //condicao
      return res.status(500).send("Erro ao cadastrar") // case true status 500

    return res.redirect("/produtos") // case false redireciona para a pagina produtos
  })
})

//EDITAR RETORNA CAMPOS PREENCHIDOS
app.get("/editarProdutos/:id", (req, res) => {
  Produtos.findById(req.params.id, (err, produto) => {
    if (err)
      return res.status(500).send("Erro ao consultar Produto")
    res.render("editarProdutos", {
      item: produto
    })
  })
})

//editar e salvar
app.post("/editarProdutos", (req, res) => {
  var id = req.body.id
  Produtos.findById(id, (err, produto) => {
    if (err)
      return res.status(500).send("Erro ao consutlar Produto")
    produto.nome = req.body.nome
    produto.valUni = req.body.valor
    produto.codBarras = req.body.codBar

    produto.save(err => {
      if (err)
        return res.status(500).send("Erro ao editar produtos")
      return res.redirect("/produtos")
    })
  })
})


//DELETAR
app.get("/deletarProduto/:id", (req, res) => {
  var chave = req.params.id

  Produtos.deleteOne({
    _id: chave
  }, (err, result) => {
    if (err)
      return res.status(500), send("Erro ao excluir produto")
  })
  res.redirect("/produtos")
})

//definindo porta que irei acessar minha aplicacao
app.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`)
})
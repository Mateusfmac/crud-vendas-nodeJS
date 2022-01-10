var mongoose = require("mongoose")

mongoose.connect("mongodb+srv://mateus_machado:mateus_machado@cluster0.nobsl.mongodb.net/vendas?retryWrites=true&w=majority").then(() => {
  console.log("Deu Bom!")
}).catch((err) => {
  console.log("Deu Bosta!" + err)
})
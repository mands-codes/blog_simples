const Sequelize = require("sequelize");
const connection = require("../database/database");
//IMPORTAR O MODEL QUE VAMOS NOS RELACIONAR
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})
//RELACIONAMENTOS DE MAO DUPLA
// Uma categoria tem muitos artigos
Category.hasMany(Article);
//Um artigo pertence a uma categoria 
Article.belongsTo(Category);

//sempre que cria um relacionamento,se atualiza os bancos de dados
//sempre remover o sync depois de criar a tabela pela primeira vez
module.exports = Article; 
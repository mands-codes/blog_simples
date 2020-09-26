const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const articlesController = require("./articles/ArticlesController");
const categoriesController = require("./categories/CategoriesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");
const { render } = require("ejs");

//View Engine
app.set('view engine', 'ejs');
//usar arquivos estaticos (css, imgs)
app.use(express.static('public'));

//Sessions
//calcular tempo em mile segundos
app.use(session({
    secret: "gatinho", cookie: { maxAge: 30000 }
}));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

///Database
connection.authenticate().then(() =>{
    console.log("conexão feita com sucesso")
}).catch((error)=>{
    console.log(error);
})

//UTILIZAR AS ROTAS QUE ESTAO DENTRO DO CATEGORIES CONTROLER
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req,res) =>{
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render("index",{articles : articles, categories: categories});
        });
        
    });
});
//Redirecionar a pessoa para o artigo selecionado e buscar as categorias para preencher a navbar dinamica
app.get("/:slug", (req,res) =>{
    var slug = req.params.slug;

    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{article : article, categories: categories});
        });
    }else{
            res.redirect("/");        
        }
    }).catch(err =>{
        res.redirect("/");     
    });
})
//Fazer uma pagina para os artigos de cada categoria
app.get("/category/:slug", (req,res) =>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    });
})


app.listen(8080, ()=>{
    console.log("servidor está rodando")
})
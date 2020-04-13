const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //Devolve todos os repositórios cadastrados

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  //Cria novo repositório na base
  //Recebe title, url (link para o repositório do github) e techs de request.body
  //Objeto a ser salvo:
  /*{ 
      id: "uuid", 
      title: 'Desafio Node.js', 
      url: 'http://github.com/...', 
      techs: ["Node.js", "..."], 
      likes: 0
    }*/

    const { title, url, techs } = request.body;
    const repository = { id: uuid(), title, url, techs, likes: 0 };
  
    repositories.push(repository);
  
    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  //Altera o repositório identificado pelo id
  //Permitida apenas a alteração de title, url e/ou techs

  const { id } = request.params;
  const { title, url, techs, likes } = request.body;
  const respositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (respositoryIndex < 0) return response.status(400).json({error: "Bad Request. Project not found!"});

  if (likes) return response.status(400).json({likes: 0});

  const respository = {
    id,
    title,
    url,
    techs
  };

  repositories[respositoryIndex] = respository;

  return response.json(respository);
});

app.delete("/repositories/:id", (request, response) => {
  //Deleta o repositório identificado pelo id

  const { id } = request.params;
  const respositoryIndex = repositories.findIndex(respository => respository.id === id);

  if (respositoryIndex < 0) return response.status(400).json({error: "Bad Request. Project not found!"});

  repositories.splice(respositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  //Soma um like a um repositório identificado pelo id
  
  const { id } = request.params;
  const respositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (respositoryIndex < 0) return response.status(400).json({error: "Bad Request. Project not found!"});

  const respository = repositories.find(repository => repository.id === id);
  respository.likes += 1;

  return response.json({ likes: respository.likes });
});

module.exports = app;

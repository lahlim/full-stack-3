const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/Person");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("data", function(tokens, req, res) {
  return JSON.stringify(req.body);
});

app.use(morgan("tiny"));
app.use(morgan("data"));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.get("/api/info", (req, res) => {
  Person.find({}).count({}, function(err, c) {
    res.send(
      `<p>Puhelin luettelossa on ${c} henkilöä.</p>
      <p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => {
      console.log(error);
      response.status(404).end();
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (note) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);

  if (body.name === undefined) {
    return response.status(400).json({ error: "Name missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON());
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

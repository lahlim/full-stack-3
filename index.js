const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

morgan.token('data', function(tokens, req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan('tiny'));
app.use(morgan('data'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

let persons = [
  {
    name: 'Arto Hellas',
    number: '123',
    id: 1
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4
  }
];

app.get('/info', (req, res) => {
  res.send(
    `<p>Puhelin luettelossa on ${persons.length} henkilöä.</p>
    <p>${new Date()}</p>`
  );
});

app.get('/persons', (req, res) => {
  res.json(persons);
});

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(note => note.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter(note => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0;
  return maxId + 125;
};

app.post('/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }

  const unique = persons.find(person => person.name === body.name);
  if (unique) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    name: body.name,
    number: body.number || false,
    date: new Date(),
    id: generateId()
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

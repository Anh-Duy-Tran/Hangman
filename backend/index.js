const express = require('express');
const cors = require('cors');

const wordService = require('./service/word');
const e = require('express');

const app = express()

app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const revealGuess = (WORD, SECRET, Guess) => {
  for (let i = 0; i < WORD.length; i++) {
    if (WORD[i] === Guess.toUpperCase()) {
      SECRET[i] = WORD[i]
    }
  }
  console.log(SECRET);
}

let WORD = '';
let SECRET = [];
let ATTEMPTS = [];
let CLUES = [];

app.use(requestLogger)
app.use(cors())

// app.use(express.static('build'))

// TESTING
app.get('/api/word', (req, res) => {
  res.json(WORD)
})

app.get('api/attempt', (req, res) => {
  res.json(ATTEMPTS)
})


// init a new game, first fetch a new word from the api then
// reset all the server variable
app.post('/api/init', async (req, res) => {
  
  WORD = await wordService.getWord();
  WORD = WORD.toUpperCase();

  SECRET.splice(0, SECRET.length);
  for (let i = 0; i < WORD.length; i++) {
    SECRET.push('_');
  }
  ATTEMPTS = [];
  CLUES = [];
})

app.put('/api/attempt', (req, res) => {
  if (WORD.length === 0) {
    res.status(500).json({error : "Word not initiated"})
    return;
  }
  let attempt = req.body.attempt

  if (!ATTEMPTS.some(c => c === attempt)) {
    ATTEMPTS.push(attempt)
    revealGuess(WORD, SECRET, attempt)
    res.json(SECRET)
  } else {
    res.status(400).json({error : "Already guessed"})
  }
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
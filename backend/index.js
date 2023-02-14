const express = require('express');
const cors = require('cors');

const wordService = require('./service/word');
const gifService = require('./service/giphy');

const app = express()

function idGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const revealGuess = (session, Guess) => {
  let rightGuess = false;

  for (let i = 0; i < session.word.length; i++) {
    if (session.word[i] === Guess.toUpperCase()) {
      rightGuess = true;
      session.secret[i] = session.word[i]
    }
  }
  
  if (!rightGuess) {
    session.failAttempt = Number(session.failAttempt) + 1;
  }

  if (Number(session.failAttempt) === 6) {
    for (let i = 0; i < session.word.length; i++) {
      if (session.secret[i] === '_') {
        session.secret[i] = session.word[i].toLowerCase()
      }
    }
  }
}

let Sessions = {}



app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

const getSession = (id) => {
  if (!(id in Sessions)) {
    return null;
  }
  return Sessions[id];
}


app.use(express.static('build'))

// TESTING
app.post('/api/word', (req, res) => {
  const id = req.body.id
  const session = getSession(id)

  if (session === null) {
    res.status(400).json({error : "No exist session with id"}).end()
    return;
  }

  res.json(session.word).end();
})

app.post('/api/attempt', (req, res) => {
  const id = req.body.id
  const session = getSession(id)

  if (session === null) {
    res.status(400).json({error : "No exist session with id"}).end()
    return;
  }

  res.json(session.attempt).end();
})

app.post('/api/clue/:id', (req, res) => {
  const idSession = req.body.id
  const session = getSession(idSession)

  if (session === null) {
    res.status(400).json({error : "No exist session with id"}).end()
    return;
  }

  if (session.clues.length === 0) {
    res.status(400).json({error : "no clue yet."}).end();
    return;
  }
  
  const id = req.params.id;
  if (id < 0 || id > 2) {
    res.status(400).json({error : "cannot access clue."}).end();
    return;  
  }

  res.status(200).json(session.clues[req.params.id]).end()
})

app.get('/api/sessions', (req, res) => {
  res.json(Sessions);
});


// init a new game, first fetch a new word from the api then
// reset all the server variable
app.post('/api/init', (req, res) => {
  wordService
    .getWord()
    .then(word => {
      const sessionID = idGenerator();
      console.log(word);
      let WORD = '';
      let SECRET = [];
      let ATTEMPTS = [];

      WORD = word.toUpperCase();
    
      SECRET.splice(0, SECRET.length);
      for (let i = 0; i < WORD.length; i++) {
        SECRET.push('_');
      }
      ATTEMPTS = [];
      gifService.getClues(word).then(CLUES => {
        const session = {
          id : sessionID,
          word : WORD,
          secret : SECRET,
          attempt : ATTEMPTS,
          clues : CLUES,
          failAttempt : 0
        }
  
        Sessions[sessionID] = session
  
        return res.status(200).json({id : sessionID, data : SECRET}).end();
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err).end();
    });
})

app.put('/api/attempt', (req, res) => {
  const idSession = req.body.id

  const session = getSession(idSession)

  if (session === null) {
    res.status(400).json({error : "No exist session with id"}).end()
    return;
  }

  if (session.word.length === 0) {
    res.status(500).json({error : "Word not initiated"})
    return;
  }

  if (Number(session.failAttempt) >= 6) {
    res.status(400).json({error : "Gameover"}).end()
    return;
  }

  let attempt = req.body.attempt

  if (!session.attempt.some(c => c === attempt)) {
    session.attempt.push(attempt)
    revealGuess(session, attempt)
    res.json({
      data : session.secret, 
      gameOver : Number(session.failAttempt) >= 6,
      win : JSON.stringify(session.word)==JSON.stringify(session.secret),
      failAttempt : session.failAttempt
    })
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
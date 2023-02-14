import axios from 'axios'

const url = 'http://localhost:3001/api'
let sessionID = ""


const setSession = (id) => {
  sessionID = id;
}

const newGame = () => {
  const request = axios.post(url + '/init')
  return request.then(r => r.data)
}

const getClue = (id) => {
  console.log(sessionID);
  const request = axios.post(url + '/clue/' + id, {id : sessionID})
  return request.then(r => r.data)
}

const guess = (guess) => {
  const request = axios.put(url + '/attempt', {attempt : guess, id : sessionID})
  return request.then(r => r.data)
}

const services = { newGame, getClue, guess, setSession }

export default services
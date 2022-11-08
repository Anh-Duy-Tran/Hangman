import './App.css';
import Clue from './components/Clue'
import Game from './components/Game'
import Word from './components/Word'
import KeyBoard from './components/Keyboard';
import hangmanService from './services/hangman';

import { useState, useEffect } from 'react'

function App() {

  const [ currentWord, setCurrentWord ] = useState("")
  const [ gameOver, setGameOver ] = useState(false);
  const [ gameState, setGameState ] = useState(0);
  const [ clueURLs, setClueURLs ] = useState([null, null, null]);
  const [ pressed, setPressed ] = useState([])

  const hook = () => {
    hangmanService
      .newGame()
      .then(res => {
        hangmanService.setSession(res.id)

        setPressed([])
        setClueURLs([null, null, null])
        setCurrentWord(res.data.join(' '))
        setGameOver(false);
        setGameState(0);
      })
      .catch(console.log)
  }

  useEffect(hook, [])

  const stickManOnClick = (e) => {
    hook();
  }

  const onClick = (e) => {
    if (gameOver) {
      return;
    }

    const key = e.currentTarget;
    const guess = key.getAttribute('value')
    setPressed(pressed.concat(guess))

    hangmanService
      .guess(guess)
      .then(res => {
        if (res.gameOver) {
          setGameOver(true);
        }
        const state = Number(res.failAttempt)
        if (state !== gameState) {
          setGameState(state)
        }
        setCurrentWord(res.data.join(' '))
      })
  }

  const clueOnClick = (e) => {
    const clue = e.currentTarget
    const index = clue.getAttribute('value')
    hangmanService
      .getClue(index)
      .then(url => {
        const newURLs = [...clueURLs]
        newURLs[index] = url
        setClueURLs(newURLs)
      }) 
  }

  return (
    <>
      <div className='display'>
        <Clue clueURLs={clueURLs} onClick={clueOnClick}></Clue>
        <Game gameState = {gameState} onClick={stickManOnClick}></Game>
        <Word word={currentWord}></Word>
      </div>
      <div className='keyboardContainer'>
        <KeyBoard onClick={onClick} gameOver ={gameOver} pressed={pressed}></KeyBoard>
      </div>
    </>
  );
}

export default App;

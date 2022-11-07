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
  const [ gameRestarted, setResart ] = useState(0);

  const hook = () => {
    hangmanService
      .newGame()
      .then(res => {
        hangmanService.setSession(res.id)

        setResart(gameRestarted + 1);
        setCurrentWord(res.data.join(' '))
        setGameOver(false);
        setGameState(0);
      })
      .catch(console.log)
  }

  useEffect(hook, [])

  const stickManOnClick = (e) => {
    hook();
    setResart(gameRestarted + 1);
  }

  const onClick = (e) => {
    if (gameOver) {
      return;
    }

    const key = e.currentTarget;
    key.classList.add('Pressed');

    const guess = key.getAttribute('value')

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
    console.log(clue);

    hangmanService
      .getClue(clue.getAttribute('value'))
      .then(url => {
        
        clue.innerHTML = `<img src=${url} className="Img"></img>`

      }) 
  }

  return (
    <>
      <div className='display'>
        <Clue numberOfClue = {3} onClick={clueOnClick} hook={gameRestarted}></Clue>
        <Game gameState = {gameState} onClick={stickManOnClick}></Game>
        <Word word={currentWord}></Word>
      </div>
      <div className='keyboardContainer'>
        <KeyBoard hook={gameRestarted} onClick={onClick} gameOver ={gameOver} ></KeyBoard>
      </div>
    </>
  );
}

export default App;

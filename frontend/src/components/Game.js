import images from '../resources/index'

const Game = ( {gameState, onClick }) => {
  return (
    <div onClick={onClick} className="Game"  style={{backgroundImage : `url(${images[gameState]})`}}></div>
  )
}

export default Game
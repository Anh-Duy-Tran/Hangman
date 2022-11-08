const KeyBoard = ( { onClick, gameOver, pressed }) => {
  let rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="Keyboard">
      {
        rows.map((row, i) => {
          return (
            <div className="Row" key={i}>
            {row.map((tile, i) => <div key={i} className={gameOver || pressed.some( p => p === tile) ? "Key Pressed" : "Key"} onClick={onClick} value={tile}><p>{tile}</p></div>)}
            </div>
          )
        })
      }
    </div>
  )
}



export default KeyBoard
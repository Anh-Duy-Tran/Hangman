const KeyBoard = ( { onClick, gameOver, hook }) => {
  let rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const className = gameOver ? "Key Pressed" : "Key"

  return (
    <div className="Keyboard">
      {
        rows.map((row, i) => {
          return (
            <div className="Row" key={i}>
            {row.map((tile, i) => <div key={i} className={className} onClick={onClick} value={tile}><p>{tile}</p></div>)}
            </div>
          )
        })
      }
    </div>
  )
}



export default KeyBoard
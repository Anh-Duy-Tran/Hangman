const Clue = ( { numberOfClue, onClick, hook } ) => {
  
  return (
    <div className="ClueContainer">
      <div className="Clue" onClick={onClick} value={0}> <p>Hint 1</p> </div>
      <div className="Clue" onClick={onClick} value={1}> <p>Hint 2</p> </div>
      <div className="Clue" onClick={onClick} value={2}> <p>Hint 3</p> </div>
    </div>
  );
}

export default Clue
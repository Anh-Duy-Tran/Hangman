import Gif from './Gif'

const Clue = ( { clueURLs, onClick, hook } ) => {
  
  return (
    <div className="ClueContainer">
      <div className="Clue" onClick={onClick} value={0}> <Gif url={clueURLs[0]} index={0}></Gif> </div>
      <div className="Clue" onClick={onClick} value={1}> <Gif url={clueURLs[1]} index={1}></Gif> </div>
      <div className="Clue" onClick={onClick} value={2}> <Gif url={clueURLs[2]} index={2}></Gif> </div>
    </div>
  );
}

export default Clue
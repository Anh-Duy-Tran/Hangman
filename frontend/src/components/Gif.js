const Gif = ( { url, index }) => {
  if (url === null) {
    return (
      <p>Hint {index + 1}</p>
    )
  }
  return (
    <img src={url} className="Img" alt={`clue #${index}`}></img>
  )
}

export default Gif
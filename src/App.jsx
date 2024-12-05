import Player from "./components/Players"  
import GameBoard from "./components/GameBoard"
import { useState } from "react"
import Log from "./components/Log"
import { WINNING_COMBINATIONS } from "./components/winning-combinations"
import GameOver from "./components/GameOver"

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
}

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function definePlayer(gameTurns){
  let currentPlayer = 'X'
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O'
  }
  return currentPlayer
}

function deriveWinner(gameBoard, players) {
  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const symbolOne = gameBoard[combination[0].row][combination[0].column];
    const symbolTwo = gameBoard[combination[1].row][combination[1].column];
    const symbolThree = gameBoard[combination[2].row][combination[2].column];
    if (symbolOne && symbolOne === symbolTwo && symbolOne === symbolThree) {
      winner = players[symbolOne];
    }
  }
  return winner;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...initialGameBoard.map(row => [...row])]

  for (const turn of gameTurns) {
      const {square, player} = turn;
      const {row, col} = square;
      gameBoard[row][col] = player;
  };

  return gameBoard;
}

function App() {
  const [gameTurns, setGameTurns] = useState([])
  const [players, setPlayers] = useState({PLAYERS})

  const gameBoard = deriveGameBoard(gameTurns)
  const currentPlayer = definePlayer(gameTurns)
  const winner = deriveWinner(gameBoard, players)
  const hasDraw = gameTurns.length === 9 && !winner

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevGameTurns) => {
      const currentPlayer = definePlayer(prevGameTurns)
      const updatedTurns = [
        {square: {row: rowIndex, col:colIndex}, player: currentPlayer},...prevGameTurns
      ];
      return updatedTurns
    })
  }

  function handleRestart() {
    setGameTurns([])
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return { ...prevPlayers, [symbol]: newName }
    })
  }

  return ( 
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="PLAYERS.X" symbol="X" isActive={currentPlayer === 'X'} onChangeName={handlePlayerNameChange}/>
          <Player initialName="PLAYERS.O" symbol="O" isActive={currentPlayer === 'O'} onChangeName={handlePlayerNameChange}/>
        </ol>
        {winner && <GameOver winner={winner} onRestart={handleRestart}/>}
        {hasDraw && <GameOver draw={hasDraw} onRestart={handleRestart}/>}
        <GameBoard  
        onSelectSquare={handleSelectSquare}
        board={gameBoard}
          />
      </div>
      
      <Log turns={gameTurns}/> 
    </main>)
}

export default App

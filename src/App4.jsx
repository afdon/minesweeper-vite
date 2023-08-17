import { useState } from 'react';
import './App.css'

export default function App() {


    const [settings, setSettings] = useState({
        numMines: 25,
        numRows: 16,
        numCols: 20,
      });
    
      const [revealedCells, setRevealedCells] = useState(
        new Array(settings.numRows * settings.numCols).fill(false)
      );
    
      const [gameState, setGameState] = useState('playing');
    
      const [flagged, setFlagged] = useState(
        new Array(settings.numMines).fill(false)
      );
    
      let total = settings.numRows * settings.numCols;
    
      const toggleFlag = (element, index) => {
        element.preventDefault();
    
        if (revealedCells[index]) return;
    
        let flaggedCopy = [...flagged];
        flaggedCopy[index] = !flaggedCopy[index];
        setFlagged(flaggedCopy);
    
        checkWin();
      };
    
      const handleChangeSettings = (operation, property) => {
        let increment = 1;
        if (property === 'numMines') {
          increment = 5;
        }
    
        if (operation === 'remove') {
          increment = increment * -1;
        }
    
        setSettings((prevSettings) => ({
          ...prevSettings,
          [property]: prevSettings[property] + increment,
        }));
      };
    
      let numRevealed = revealedCells.filter((cell) => cell === true).length;
      let numFlagged = flagged.filter((cell) => cell === true).length;
    
      let checkWin = () => {
        console.log('numRevealed', numRevealed);
        console.log('numFlagged', numFlagged);
    
        if (numRevealed + numFlagged >= total) {
          setGameState('won');
        }
      };
    
      const getDisplayValue = (element) => {
        if (element === 0) return '';
        if (element >= 10) return '💣';
        if (element > 0 && element < 10) return element;
        return element; // if none of the conditions match
      };
    
      let board = createBoard(settings.numRows, settings.numCols);
      let minesIdx = generateMineIndices(
        settings.numMines,
        settings.numRows,
        settings.numCols
      );
    
      board = fillMines(minesIdx, board, settings);
    
      let display = board.map((e) => getDisplayValue(e));
    
      ////
    
      const handleCellClick = (index) => {
        // console.log(revealedCells[index], index);
    
        let newRevCells;
    
        if (board[index] >= 10) {
          setGameState('lost');
          newRevCells = new Array(settings.numRows * settings.numCols).fill(true);
        } else {
          newRevCells = [...revealedCells];
          const cellsToReveal = findConnectedCellsToReveal(index, board, settings);
          cellsToReveal.forEach((c) => {
            newRevCells[c] = true;
          });
          newRevCells[index] = true;
        }
    
        setRevealedCells(newRevCells);
      };
    
      // const findConnectedCellsToReveal = (index, board, settings) => {
      //   let queue = [index];
      //   let visited = [];
      //   let cellsToReveal = [];
    
      //   let counter = 0;
    
      //   while (queue.length > 0 && counter < settings.numRows * settings.numCols) {
      //     counter++;
      //     let curCell = queue.shift();
    
      //     if (board[curCell] === 0) {
      //       let neighbors = getNeighborsIdx(
      //         curCell,
      //         settings.numRows,
      //         settings.numCols
      //       ).slice(0, 4);
      //       neighbors.forEach((n) => {
      //         cellsToReveal.push(n);
    
      //         if (n !== null && !visited.includes(n) && board[n] === 0) {
      //           visited.push(n);
      //           queue.push(n);
      //         }
      //       });
      //     }
      //   }
    
      //   return cellsToReveal;
      // };
    
      const findConnectedCellsToReveal = (index, board, settings) => {
        let queue = [index];
        let visited = [];
        let cellsToReveal = [];
      
        while (queue.length > 0 && cellsToReveal.length < settings.numRows * settings.numCols) {
          let curCell = queue.shift();
          visited.push(curCell); // Mark the current cell as visited
      
          if (board[curCell] === 0) {
            let neighbors = getNeighborsIdx(
              curCell,
              settings.numRows,
              settings.numCols
            ).slice(0, 4);
            neighbors.forEach((n) => {
              if (n !== null && !visited.includes(n) && !queue.includes(n)) {
                queue.push(n); // Add valid neighbors to the queue
              }
            });
          }
      
          cellsToReveal.push(curCell); // Add the current cell to the list of cells to reveal
        }
      
        return cellsToReveal;
      };
      


    return (
        <div>{settings.numMines}</div>

    )
}
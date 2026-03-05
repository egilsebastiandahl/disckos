"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  /**
   * Prøv å lage en sudoku side med en 9x grid.
   */
  const [amountOfRowsColumns] = useState(9);
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const setFirstValues = () => {
    createRandomRows();
  };

  const createRandomRows = (amountOfRows: number = 9) => {
    // lag alle rader random, men verdiene må være unike per kolonne og rad.
    // const copyGrid = [...grid];
    // const firstRow = generateRandomRow([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    // copyGrid[0] = firstRow;
    // inital row added, add the rest of the rows
    // copyGrid.forEach((row, index) => {
    //   createRandomRow(row, index, copyGrid);
    // });
    // const secondRow = createRandomRow(copyGrid[1], 1, copyGrid);
    // const thirdRow = createRandomRow(copyGrid[2], 2, copyGrid);
    // const fourthRow = createRandomRow(copyGrid[3], 3, copyGrid);
    // copyGrid[1] = secondRow;
    // copyGrid[2] = thirdRow;
    // copyGrid[3] = fourthRow;

    setGrid(generateAllRowsAndReturnGrid());
  };

  const generateAllRowsAndReturnGrid = () => {
    const copyGrid = [...grid];

    let teller = 1;

    while (isGridFilled(copyGrid) && teller < 2) {
      console.log("Run: ", teller);
      for (let rowIndex = 0; rowIndex < copyGrid.length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < copyGrid[rowIndex].length; columnIndex++) {
          let validNumbersInRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          let validNumbersInColumn = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          let validNumbersInBox = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const numbersPresentInColumn = numbersInColumns(columnIndex, rowIndex, copyGrid);
          const numbersPresentInRow = numbersInRow(rowIndex, copyGrid);
          // calculate which box we are in.
          const boxNumber = 3 * Math.floor(rowIndex / 3) + Math.floor(columnIndex / 3);
          const numbersPresentInBox = numbersInBox(boxNumber, copyGrid);

          validNumbersInColumn = validNumbersInColumn.filter(
            (validNumber) => !numbersPresentInColumn.includes(validNumber),
          );
          validNumbersInRow = validNumbersInRow.filter((validNumber) => !numbersPresentInRow.includes(validNumber));
          validNumbersInBox = validNumbersInBox.filter((validNumber) => !numbersPresentInBox.includes(validNumber));
          if (copyGrid[rowIndex][columnIndex] == 0) {
            console.log("Valid numbers for: row: ", rowIndex, " - column: ", columnIndex);
            copyGrid[rowIndex][columnIndex] = getRandomNumberFromValids(
              validNumbersInColumn.filter(
                (validColumnValue) =>
                  validNumbersInRow.includes(validColumnValue) && validNumbersInBox.includes(validColumnValue),
              ),
            );
          }
        }
      }
      teller++;
    }

    return copyGrid;
  };

  const isGridFilled = (grid: number[][]) => {
    grid.forEach((r) => {
      if (r.find((value) => value == 0)) {
        return false;
      }
    });
    return true;
  };

  const numbersInColumns = (columnIndex: number, rowIndex: number, grid: number[][]): number[] => {
    const numbersSoFarInColumn: number[] = [];
    for (let i = 0; i < rowIndex; i++) {
      // check columns only for the previous rows
      grid[i].forEach((value, j) => {
        if (j == columnIndex) numbersSoFarInColumn.push(value);
      });
    }
    return numbersSoFarInColumn;
  };

  const numbersInBox = (boxNumber: number, grid: number[][]): number[] => {
    const numbersSoFarInBox: number[] = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const currentBoxNumber = 3 * Math.floor(i / 3) + Math.floor(j / 3);
        if (boxNumber == currentBoxNumber) {
          numbersSoFarInBox.push(grid[i][j]);
        }
      }
    }

    return numbersSoFarInBox;
  };

  const numbersInRow = (rowIndex: number, grid: number[][]): number[] => {
    return grid[rowIndex];
  };

  const getRandomNumberFromValids = (validNumbers: number[]): number => {
    if (validNumbers.length == 1) return validNumbers[0];
    console.log(validNumbers);

    const randomIndex = Math.floor(Math.random() * validNumbers.length);
    return validNumbers[randomIndex];
  };

  // const createRandomRow = (row: number[], rowIndex: number, tempGrid: number[][]) => {
  //   // check the row and the entire column wether the random number is valid

  //   let validNumbersInColumn: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  //   let validNumbersInRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  //   // Create the valid numbers array based on whatever is in previous columns
  //   for (let i = 0; i < rowIndex; i++) {
  //     // check columns only for the previous rows
  //     tempGrid[i].forEach((value, j) => {
  //       const numbersInColumn: number[] = numbersInColumns(j, i, tempGrid);
  //       // console.log("run: ", i, " numbers in columns: ", numbersInColumn);
  //       // make sure the numbers are valid between the numbers in column and the ones in the row now.
  //       validNumbersInColumn = validNumbersInColumn.filter((validNumber) => !numbersInColumn.includes(validNumber));
  //       console.log("Valid numbers in column: ", validNumbersInColumn);
  //       // newValidNumbers contains all the numbers that still may be used on the current point, after removing all the "used" numbers from the previous columns. All needed now is to make sure the number doesnt exist in the row.
  //     });
  //   }
  //   // return generateRandomRow(validNumbers);
  // };

  /**
   * Randomizes order between 2 numbers, and locks the last number
   * @returns a randomized list of numbers between 1 and 9
   */
  // const generateRandomRow = (validNumbers: number[]): number[] => {
  //   for (let i = validNumbers.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [validNumbers[i], validNumbers[j]] = [validNumbers[j], validNumbers[i]];
  //   }

  //   return validNumbers;
  // };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFirstValues();
  }, []);

  return (
    <>
      <HeaderSection title="Favoritter" text="Her er favoritt-discene til hele gjengen!" />
      <main>
        <section>Her er neste seksjonen</section>
        {grid.map((row, i) => {
          return (
            <div id="rad" className="flex w-fit gap-4" key={i}>
              {row.map((col, j) => {
                return (
                  <div id="kolonne" className="w-8 border" key={j}>
                    {col}
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import Vehicle from "./Vehicle";
import Accelerometer from "./Accelerometer";
import PropTypes from "prop-types";

const Grid = ({
  rows,
  cols,
  onTileChange,
  accelData,
  setAccelData,
  setAccelStatus,
  setGpsStatus,
  setProgressData,
}) => {
  const [vehiclePosition, setVehiclePosition] = useState({ row: 0, col: 0 });
  const [visitedTiles, setVisitedTiles] = useState(new Set());

  // Create initial grid based on rows and columns with additional properties
  const [grid, setGrid] = useState(
    Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        compactness: Math.floor(Math.random() * 5), // Compactness value less than 5
        img: "soil0.png", // Initial color
        gps: {
          lng: -52.71083 + colIndex * (5 / 111111), // Increment longitude by 5 meters (approx.)
          lat: 47.46656 - rowIndex * (5 / 111111), // Increment latitude by 5 meters (approx.)
          alt: 26.25616455078125,
        },
      }))
    )
  );

  const previousTileDataRef = useRef(null);

  const getImageByCompactness = (compactness) => {
    switch (compactness) {
      case 1:
        return "soil1.png";
      case 2:
        return "soil2.png";
      case 3:
        return "soil3.png";
      case 4:
        return "soil4.png";
      case 5:
        return "soil5.png";
      default:
        return "soil0.png";
    }
  };

  const updateTile = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r, rowIndex) =>
        r.map((tile, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            const newCompactness = Math.min(tile.compactness + 1, 5);
            return {
              ...tile,
              compactness: newCompactness,
              img: getImageByCompactness(newCompactness),
            };
          }
          return tile;
        })
      );
      setVisitedTiles((prev) => new Set(prev).add(`${row}-${col}`));

      return newGrid;
    });
    setVehiclePosition({ row, col });
  };

  useEffect(() => {
    const totalTiles = rows * cols;
    let compactedTiles = 0;
    grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.compactness === 5) {
          compactedTiles++;
        }
      });
    });

    const visitedCount = visitedTiles.size;
    const percentageComplete = (compactedTiles / totalTiles) * 100;

    // Update progress data in the parent component
    setProgressData({ visitedCount, percentageComplete });
  }, [grid, visitedTiles, rows, cols, setProgressData]);

  // Handle moving the vehicle with WASD keys
  const handleKeyDown = (e) => {
    const { col, row } = vehiclePosition;
    let newRow = row;
    let newCol = col;

    // Update vehicle position based on WASD keys
    if (e.key === "w" && newRow > 0) newRow = row - 1;
    if (e.key === "s" && newRow < rows - 1) newRow = row + 1;
    if (e.key === "a" && newCol > 0) newCol = col - 1;
    if (e.key === "d" && newCol < cols - 1) newCol = col + 1;

    // Update the tile and compactness when the vehicle moves over it
    updateTile(newRow, newCol);
  };

  // Add event listener for keydown events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [vehiclePosition]);

  useEffect(() => {
    if (onTileChange) {
      const { row, col } = vehiclePosition;
      const currentTile = grid[row][col];
      const currentTileData = {
        gps: currentTile.gps,
        compactness: currentTile.compactness,
      };
      if (
        !previousTileDataRef.current ||
        previousTileDataRef.current.gps.lat !== currentTileData.gps.lat ||
        previousTileDataRef.current.gps.lng !== currentTileData.gps.lng ||
        previousTileDataRef.current.compactness !== currentTileData.compactness
      ) {
        previousTileDataRef.current = currentTileData;

        onTileChange(currentTileData);
      }
    }
  }, [vehiclePosition, grid, onTileChange]);

  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 50px)`,
        gridTemplateColumns: `repeat(${cols}, 50px)`,
      }}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((tile, colIndex) => (
            <div
              key={colIndex}
              className="tile"
              style={{
                backgroundImage: `url(/${tile.img})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
            >
              {/* Only render the vehicle in the current position */}
              {vehiclePosition.row === rowIndex &&
                vehiclePosition.col === colIndex && (
                  <>
                    <Vehicle />
                    <Accelerometer
                      tile={tile}
                      accelData={accelData}
                      setAccelData={setAccelData}
                      setAccelStatus={setAccelStatus}
                      setGpsStatus={setGpsStatus}
                    />
                  </>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

Grid.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  onTileChange: PropTypes.func,
  accelData: PropTypes.number.isRequired,
  setAccelData: PropTypes.func.isRequired,
  setAccelStatus: PropTypes.func.isRequired,
  setGpsStatus: PropTypes.func.isRequired,
  setProgressData: PropTypes.func.isRequired,
};

export default Grid;

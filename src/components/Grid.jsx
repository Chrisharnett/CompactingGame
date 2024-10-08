import React, { useState, useEffect, useRef } from "react";
import Vehicle from "./Vehicle";
import Accelerometer from "./Accelerometer";

const Grid = ({
  rows,
  cols,
  onTileChange,
  accelData,
  setAccelData,
  setAccelStatus,
  setGpsStatus,
}) => {
  const [vehiclePosition, setVehiclePosition] = useState({ row: 0, col: 0 });

  // Create initial grid based on rows and columns with additional properties
  const [grid, setGrid] = useState(
    Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        compactness: Math.floor(Math.random() * 5), // Compactness value less than 5
        color: "gray", // Initial color
        gps: {
          lng: -52.70983 + colIndex * (3 / 111111), // Increment longitude by 3 meters (approx.)
          lat: 47.46556 + rowIndex * (3 / 111111), // Increment latitude by 3 meters (approx.)
          alt: 26.25616455078125,
        },
      }))
    )
  );

  const previousTileDataRef = useRef(null);

  // Update the color based on compactness
  const getColorByCompactness = (compactness) => {
    switch (compactness) {
      case 1:
        return "red";
      case 2:
        return "pink";
      case 3:
        return "orange";
      case 4:
        return "yellow";
      case 5:
        return "green";
      default:
        return "gray";
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
              color: getColorByCompactness(newCompactness),
            };
          }
          return tile;
        })
      );

      return newGrid;
    });
    setVehiclePosition({ row, col });
  };

  // Handle moving the vehicle with WASD keys
  const handleKeyDown = (e) => {
    const { col, row } = vehiclePosition;
    let newRow = row;
    let newCol = col;

    // Update vehicle position based on WASD keys
    if (e.key === "w" && newRow > 0) newRow = row - 1; // Move up (W key)
    if (e.key === "s" && newRow < rows - 1) newRow = row + 1; // Move down (S key)
    if (e.key === "a" && newCol > 0) newCol = col - 1; // Move left (A key)
    if (e.key === "d" && newCol < cols - 1) newCol = col + 1; // Move right (D key)

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
              style={{ backgroundColor: tile.color }}
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

export default Grid;

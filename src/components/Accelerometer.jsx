import { useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const Accelerometer = ({
  tile,
  setAccelData,
  setAccelStatus,
  setGpsStatus,
}) => {
  const { compactness, gps } = tile;
  const accelDataPoints = useRef([]); // To store multiple data points within each second

  useEffect(() => {
    const frequency = 1 / (compactness + 1);

    // Create an oscillating value (simulated accelData)
    const generationInterval = setInterval(() => {
      const newAccelData =
        Math.sin(Date.now() * 0.1 * frequency) * (6 - compactness);
      setAccelData(newAccelData);

      // Generate x, y, z data points
      const x = newAccelData + Math.random() * 0.5; // Adding some randomness
      const y = newAccelData + Math.random() * 0.5;
      const z = newAccelData + Math.random() * 0.5;
      const dt = new Date().toISOString(); // ISO timestamp for the data point

      // Store generated data point
      accelDataPoints.current.push({ x, y, z, dt });
    }, 100); // Generates a new value every 100ms

    // Interval to send aggregated data to the API every second
    const apiInterval = setInterval(() => {
      if (accelDataPoints.current.length > 0) {
        // Prepare the payload with multiple data points and sensor ID
        const accelerometerPayload = {
          Data: accelDataPoints.current,
          SensorId: "CHAccelOne",
        };

        // Post the aggregated data to the accelerometer endpoint
        axios
          .post(
            "http://173.35.143.161:1976/DataCollector/Accelerometer",
            accelerometerPayload,
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((response) => {
            setAccelStatus(response.status);
          })
          .catch((error) => {
            console.error("Error posting accelerometer data:", error);
          });

        // Prepare GPS data payload
        if (gps) {
          const gpsPayload = {
            Data: [
              {
                lng: gps.lng,
                lat: gps.lat,
                alt: gps.alt,
                dt: new Date().toISOString(),
              },
            ],
            SensorId: "CHGPSOne",
          };

          // Post the GPS data to the GPS endpoint
          axios
            .post("http://173.35.143.161:1976/DataCollector/GPS", gpsPayload, {
              headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
              setGpsStatus(response.status);
            })
            .catch((error) => {
              console.error("Error posting GPS data:", error);
            });
        }

        // Clear the stored values for the next aggregation period
        accelDataPoints.current = [];
      }
    }, 1000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(generationInterval);
      clearInterval(apiInterval);
    };
  }, [compactness, gps, setAccelData]);
};

Accelerometer.propTypes = {
  tile: PropTypes.shape({
    compactness: PropTypes.number.isRequired,
    gps: PropTypes.shape({
      lng: PropTypes.number,
      lat: PropTypes.number,
      alt: PropTypes.number,
    }),
  }).isRequired,
  setAccelData: PropTypes.func.isRequired,
  setAccelStatus: PropTypes.func.isRequired,
  setGpsStatus: PropTypes.func.isRequired,
};

export default Accelerometer;

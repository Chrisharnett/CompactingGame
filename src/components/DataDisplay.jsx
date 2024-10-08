import React from "react";
import { Container } from "react-bootstrap";
import { useState } from "react";

const DataDisplay = ({
  compactness,
  accelData,
  gps,
  accelStatus,
  gpsStatus,
}) => {
  const [accelId, setAccelId] = useState("CHACCEL1");
  const [gpsId, setGpsId] = useState("CHGPS1");

  const statusDisplay = (status) => {
    switch (status) {
      case 200:
        return { text: "Data Error", color: "yellow" };
      case 201:
        return { text: "Connected", color: "green" };
      default:
        return { text: "Disconnected", color: "red" };
    }
  };

  return (
    <>
      <Container>
        <h4>Accelerometer ID: {accelId} </h4>
      </Container>
      <Container>
        Accelerometer Status:{" "}
        <span style={{ color: statusDisplay(accelStatus).color }}>
          {statusDisplay(accelStatus).text}
        </span>
      </Container>
      <Container>Data: {accelData.toFixed(2)}</Container>
      <Container>Ground density: {compactness}</Container>
      <Container>
        <h4>GPS Sensor ID: {gpsId}</h4>
      </Container>
      <Container>
        GPS Status:{" "}
        <span style={{ color: statusDisplay(gpsStatus).color }}>
          {statusDisplay(gpsStatus).text}
        </span>
      </Container>

      <Container>
        <p>GPS location</p>
        <p> lng: {gps?.lng} </p>
        <p>lat:{gps?.lat}</p>
        <p>alt: {gps?.alt}</p>
      </Container>
    </>
  );
};

export default DataDisplay;

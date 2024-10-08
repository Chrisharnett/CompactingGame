import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Grid from "./components/Grid";
import DataDisplay from "./components/DataDisplay";
import { useState } from "react";

const App = () => {
  const [accelData, setAccelData] = useState(0);
  const [currentTileInfo, setCurrentTileInfo] = useState(null);
  const [accelStatus, setAccelStatus] = useState("Not Connected");
  const [gpsStatus, setGpsStatus] = useState("Not Connected");

  const handleTileData = (tileData) => {
    setCurrentTileInfo(tileData);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center fullVSize">
      <Container className="App justify-content-center align-items-center fullVSize">
        <Row className="text-center">
          <Col>
            <h1>Prepare the build site.</h1>
          </Col>
        </Row>
        <Row className="justify-content-center ">
          <Col sm={8} className="m-1 p-1">
            <Grid
              rows={10}
              cols={10}
              accelData={accelData}
              setAccelData={setAccelData}
              onTileChange={handleTileData}
              setAccelStatus={setAccelStatus}
              setGpsStatus={setGpsStatus}
            />
          </Col>
        </Row>
        <Row>
          <DataDisplay
            accelData={accelData}
            compactness={currentTileInfo?.compactness}
            gps={currentTileInfo?.gps}
            accelStatus={accelStatus}
            gpsStatus={gpsStatus}
          />
        </Row>
      </Container>
    </Container>
  );
};

export default App;

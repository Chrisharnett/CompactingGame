import { Container, Row, Col, Navbar } from "react-bootstrap";
import Grid from "./components/Grid";
import DataDisplay from "./components/DataDisplay";
import { useState } from "react";
import { Spacer } from "./components/Spacer";

const App = () => {
  const [accelData, setAccelData] = useState(0);
  const [currentTileInfo, setCurrentTileInfo] = useState(null);
  const [accelStatus, setAccelStatus] = useState("Not Connected");
  const [gpsStatus, setGpsStatus] = useState("Not Connected");
  const [progressData, setProgressData] = useState({
    visitedCount: 0,
    percentageComplete: 0,
  });

  const handleTileData = (tileData) => {
    setCurrentTileInfo(tileData);
  };

  return (
    <>
      <Navbar
        fixed="top"
        expand="lg"
        className="navbar-dark bg-dark p-3"
        id="top"
      >
        <Container fluid>
          <Navbar.Brand href="/">Created by Chris Harnett</Navbar.Brand>
          <Navbar.Text>
            <a href="mailto:harnettmusic@gmail.com" className="nav-link">
              Contact Me
            </a>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Spacer />
      <Container className="d-flex justify-content-center align-items-center fullVSize">
        <Container className="App justify-content-center align-items-center fullVSize">
          <Row className="text-center">
            <Col>
              <h1>Prepare the build site.</h1>
              <hr></hr>
              <p>
                Navigate your vehicle around the build site using WASD until the
                soil has reached maximum compactness.
              </p>
              <p>
                The vehicle communicates with Grand Central and submits
                accelerometer and GPS data as it moves around the site.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center ">
            <hr></hr>
            <Col sm={8} className="m-1">
              <Grid
                rows={10}
                cols={10}
                accelData={accelData}
                setAccelData={setAccelData}
                onTileChange={handleTileData}
                setAccelStatus={setAccelStatus}
                setGpsStatus={setGpsStatus}
                setProgressData={setProgressData}
              />
            </Col>
            <Col sm={3} className="p-1">
              <p>Tiles measured: {progressData.visitedCount}</p>
              <p>
                Percentage complete:{" "}
                {progressData.percentageComplete.toFixed(2)}%
              </p>
              {progressData.percentageComplete === 100 && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  Site preparation complete! All tiles have reached appropriate
                  compactness.
                </p>
              )}
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
    </>
  );
};

export default App;

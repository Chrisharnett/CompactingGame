import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import PropTypes from "prop-types";

const DataDisplay = ({
  compactness,
  accelData,
  gps,
  accelStatus,
  gpsStatus,
}) => {
  const [accelId] = useState("HARNETTACCEL1");
  const [gpsId] = useState("HARNETTGPS1");

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
      <Row>
        <Col sm={12} md={6}>
          <Container>
            <h4>Accelerometer ID:</h4>
            <p>{accelId}</p>
          </Container>
          <Container>
            Status:{" "}
            <span style={{ color: statusDisplay(accelStatus).color }}>
              {statusDisplay(accelStatus).text}
            </span>
          </Container>
          <Container>
            <hr></hr>Data: {accelData.toFixed(2)}
          </Container>
          <Container>
            <hr></hr>Ground density: {compactness}
          </Container>
        </Col>
        <Col sm={12} md={6}>
          <Container>
            <h5>GPS Sensor ID:</h5>
            <p>{gpsId}</p>
          </Container>

          <Container>
            Status:{" "}
            <span style={{ color: statusDisplay(gpsStatus).color }}>
              {statusDisplay(gpsStatus).text}
            </span>
          </Container>

          <Container>
            <hr></hr>
            <h5>GPS location</h5>
            <p className="ps-4">lng: {gps?.lng}</p>
            <p className="ps-4">lat:{gps?.lat}</p>
            <p className="ps-4">alt: {gps?.alt}</p>
          </Container>
        </Col>
      </Row>
    </>
  );
};

DataDisplay.propTypes = {
  compactness: PropTypes.number,
  accelData: PropTypes.number.isRequired,
  gps: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number,
    alt: PropTypes.number,
  }),
  accelStatus: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  gpsStatus: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default DataDisplay;

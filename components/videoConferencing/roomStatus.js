import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useState } from "react";

function RoomStatus() {
  const [value, setValue] = useState("private");

  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <Card className="mt-3 mx-auto" style={{ width: "18rem", height: "15rem" }}>
      <Card.Body>
        <Card.Title className="mb-4">Room Status</Card.Title>
        <Container>
          <div className="d-flex flex-column">
            <label className="mb-2">
              <span style={{ width: "4rem", display: "inline-block" }}>
                Private
              </span>
              <input
                type="radio"
                value="private"
                className="ms-1"
                checked={value === "private"}
                onChange={handleChange}
              />
            </label>
            <label>
              <span style={{ width: "4rem", display: "inline-block" }}>
                Public
              </span>
              <input
                type="radio"
                value="public"
                className="ms-1"
                checked={value === "public"}
                onChange={handleChange}
              />
            </label>
            <Button style={{ marginTop: "3.8rem" }} variant="primary">
              Invite
            </Button>
          </div>
        </Container>
      </Card.Body>
    </Card>
  );
}

export default RoomStatus;

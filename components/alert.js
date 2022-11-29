import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";

function CustomAlert({ variant, message, setIsAlert }) {
  return (
    <Container fluid="md" style={{ "margin-top": "5rem" }}>
      <Alert variant={variant} onClose={() => setIsAlert(false)} dismissible>
        <p>{message}</p>
      </Alert>
    </Container>
  );
}

export default CustomAlert;

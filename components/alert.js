import Alert from "react-bootstrap/Alert";

function CustomAlert({ variant, message, setIsAlert }) {
  return (
    <Alert variant={variant} onClose={() => setIsAlert(false)} dismissible>
      <p>{message}</p>
    </Alert>
  );
}

export default CustomAlert;

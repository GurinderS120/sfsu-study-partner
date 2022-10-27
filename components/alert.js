import Alert from "react-bootstrap/Alert";
import { useState } from "react";

function CustomAlert({ variant, message }) {
  const [show, setShow] = useState(true);

  return show ? (
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
      <p>{message}</p>
    </Alert>
  ) : null;
}

export default CustomAlert;

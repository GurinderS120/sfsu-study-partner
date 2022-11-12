import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import { MdRotate90DegreesCcw } from "react-icons/md";
import { useState, useRef } from "react";

function handleChoose(setFieldValue, setModal, cropperRef, img, setZoomVal) {
  const imgEle = cropperRef.current;
  const cropper = imgEle.cropper;

  if (cropper && img) {
    const imgUrl = {
      url: cropper
        .setCropBoxData({ left: 0, top: 0, width: 240, height: 240 })
        .getCroppedCanvas()
        .toDataURL(img.type),
      type: img.type,
    };
    setFieldValue("pic", imgUrl);
    setZoomVal(0);
    setModal(false);
  }
}

function PreviewImage({ modal, setModal, setFieldValue, img }) {
  // UseRef hook allows us to directly manipulate a DOM element
  const cropperRef = useRef(null);
  const [zoomVal, setZoomVal] = useState(0);

  // Following function helps to close the modal
  function handleClose() {
    setZoomVal(0);
    setModal(false);
  }

  function handleZoomChange(e) {
    setZoomVal((prevZoom) => {
      handleZoom(Number(e.target.value) - prevZoom);
      return Number(e.target.value);
    });
  }

  function handleZoom(zoomBy) {
    const imgEle = cropperRef.current;
    const cropper = imgEle.cropper;
    cropper.zoom(zoomBy);
  }

  function handleRotation() {
    const imgEle = cropperRef.current;
    const cropper = imgEle.cropper;
    cropper.rotate(90);
  }

  return (
    <Modal
      show={modal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      fullscreen="sm-down"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Image Editor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-row justify-content-center">
          <Cropper
            ref={cropperRef}
            src={img.url}
            dragMode="move"
            style={{ width: "240px", height: "240px" }}
            viewMode={0}
            background={true}
            autoCrop={true}
            autoCropArea={1}
            cropBoxMovable={false}
            cropBoxResizable={false}
            toggleDragModeOnDblclick={false}
            zoomOnTouch={false}
            zoomOnWheel={false}
          />
        </div>

        <div className="mx-auto d-flex flex-row w-50">
          <input
            value={zoomVal}
            type="range"
            min="-0.3"
            max="0.5"
            step="0.02"
            className="me-2 form-range"
            onChange={handleZoomChange}
            id="myRange"
          />

          <MdRotate90DegreesCcw
            onClick={handleRotation}
            size={30}
            type="button"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() =>
            handleChoose(setFieldValue, setModal, cropperRef, img, setZoomVal)
          }
        >
          Choose
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PreviewImage;

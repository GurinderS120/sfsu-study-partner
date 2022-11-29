import { useVideo } from "@100mslive/react-sdk";
import { useAVToggle } from "@100mslive/react-sdk";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";

function Peer({ peer }) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  const { isLocalAudioEnabled, isLocalVideoEnabled } = useAVToggle();

  return (
    <div
      className="position-relative rounded-3 bg-gradient mb-2"
      style={{ height: "270px", width: "270px" }}
    >
      <video
        ref={videoRef}
        className="rounded bg-gradient mb-2"
        autoPlay
        height={"270px"}
        width={"270px"}
        muted
        playsInline
      />

      <div
        className="d-flex flex-row justify-content-between position-absolute bottom-0 start-0 ms-2"
        style={{ width: "90%" }}
      >
        <p className="text-light">
          {peer.name} {peer.isLocal ? "(You)" : ""}
        </p>
        {isLocalAudioEnabled ? (
          <FaMicrophoneAlt className="rounded p-1" size={25} />
        ) : (
          <FaMicrophoneAltSlash className="rounded p-1" size={27} />
        )}
      </div>
    </div>
  );
}

export default Peer;

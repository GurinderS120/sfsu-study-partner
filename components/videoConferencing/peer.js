// import { useVideo } from "@100mslive/react-sdk";

function Peer({ peer }) {
  // const { videoRef } = useVideo({
  //   trackId: peer.videoTrack,
  // });

  return (
    <div
      className="position-relative rounded-3 bg-gradient mb-2"
      style={{ height: "270px", width: "270px" }}
    >
      {/* <video
        ref={videoRef}
        className="rounded bg-gradient mb-2"
        autoPlay
        height={"200px"}
        width={"200px"}
        muted
        playsInline
      /> */}

      {/* <p className="text-light position-absolute bottom-0 start-0 ms-2">
        {peer.name} {peer.isLocal ? "(You)" : ""}
      </p> */}

      <p className="text-light position-absolute bottom-0 start-0 ms-2">
        {peer.name}
      </p>
    </div>
  );
}

export default Peer;

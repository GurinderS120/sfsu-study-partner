import { useVideo } from "@100mslive/react-sdk";

function MidScreen({ localPeer }) {
  const { videoRef } = useVideo({
    trackId: localPeer.videoTrack,
  });

  return (
    <div
      className="text-light pe-5 rounded bg-gradient mb-2"
      style={{ marginTop: "2.3rem", height: "420px" }}
    >
      <video
        ref={videoRef}
        className="rounded mb-2"
        autoPlay
        height={"100%"}
        width={"632px"}
        muted
        playsInline
      />
    </div>
  );
}

export default MidScreen;

import dynamic from "next/dynamic";
import { useState } from "react";

const ZoomMeeting = dynamic(() => import("../components/zoomMeeting"), {
  ssr: false,
});

function Meeting() {
  const [meetingUrl, setMeetingUrl] = useState("");

  return (
    <div>
      <ZoomMeeting />
    </div>
  );
}

export default Meeting;

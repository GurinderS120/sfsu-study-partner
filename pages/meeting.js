import dynamic from "next/dynamic";
import { useState } from "react";

// Since zoom functions use "window" object along with other DOM objects
// so we cannot render the "ZoomMeeting" component on the server, since
// there is no "window" object available in Node runtime environment.
// Because of which we specify "ssr: false" (set server-side-rendering to
// false)
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

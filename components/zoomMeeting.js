import { ZoomMtg } from "@zoomus/websdk";
import { useEffect } from "react";

function ZoomMeeting() {
  useEffect(() => {
    hideZoomDiv();
    //ZoomMtg.prepareWebSDK();
    // loads language files, also passes any error messages to the ui
    // ZoomMtg.i18n.load("en-US");
    // ZoomMtg.i18n.reload("en-US");
  }, []);

  function hideZoomDiv() {
    document.getElementById("zmmtg-root").style.display = "none";
  }

  function showZoomDiv() {
    document.getElementById("zmmtg-root").style.display = "block";
  }

  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  const signatureEndpoint = "/api/meeting/signature";
  const sdkKey = "5nzVbulx38TJcEFZGJWrG7G2mTMSSnS5HHFR";
  const meetingNumber = "89309468296";
  const role = 0;
  const leaveUrl = "http://localhost:3000";
  const userName = "React";
  const userEmail = "hh@gmail.com";
  const passWord = "WuxNx4";
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
  // var registrantToken = "";

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function startMeeting(signature) {
    showZoomDiv();

    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.8.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          sdkKey: sdkKey,
          userEmail: userEmail,
          passWord: passWord,
          //tk: registrantToken,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default ZoomMeeting;

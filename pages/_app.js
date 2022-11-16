import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout";
import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../reduxStateManagement/store";
import { HMSRoomProvider } from "@100mslive/react-sdk";

function MyApp({ Component, pageProps }) {
  return (
    // Component represents a page and ...pageProps represents the data (if any)
    // we want to pass as props to that page.
    // Layout is a component that we created in component/layout file and it
    // contains basic styles and components that we want to display on every page
    // like navbar, footer, etc.
    // So we wrap each page (represented by Component) in the Layout component
    // and in the Layout component we display the page (Component) as its child.
    <Provider store={store}>
      <HMSRoomProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </HMSRoomProvider>
    </Provider>
  );
}

export default MyApp;

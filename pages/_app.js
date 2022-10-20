import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout";
// import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    // Component represents a page and ...pageProps represents the data (if any)
    // we want to pass as props to that page.
    // Layout is a component that we created in component/layout file and it
    // contains basic styles and components that we want to display on every page
    // like navbar, footer, etc.
    // So we wrap each page (represented by Component) in the Layout component
    // and in the Layout component we display the page (Component) as its child.
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
// import styles from "../styles/Home.module.css";

// This page is the default (home) page of our website, so it's served
// at the "/" endpoint
function Home() {
  const router = useRouter();
  const aboutRef = useRef(null);
  const productRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const { asPath } = router;

    switch (asPath.substring(2)) {
      case "about":
        aboutRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      case "product":
        productRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      default:
        contactRef.current.scrollIntoView({ behavior: "smooth" });
        break;
    }
  }, [router]);

  return (
    <>
      <div>Index</div>
      <div id="about" ref={aboutRef} style={{ marginBottom: "20rem" }}>
        About
      </div>
      <div id="product" ref={productRef} style={{ marginBottom: "20rem" }}>
        Product
      </div>
      <div id="contact" ref={contactRef} style={{ marginBottom: "20rem" }}>
        Contact
      </div>
    </>
  );
}

export default Home;

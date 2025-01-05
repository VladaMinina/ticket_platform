import "bootstrap/dist/css/bootstrap.css";

import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.log("AppComponent running...");
  console.log(appContext.ctx.req ? "Running on server" : "Running on client");
  const client = buildClient(appContext.ctx);

  return client
    .get("/api/users/currentuser")
    .then(async (res) => {
      console.log("Fetched data:", res.data);
      const { currentUser } = res.data; // Extract currentUser properly
      let pageProps = {};
      if (appContext.Component.getInitialProps) {
        // Pass currentUser properly
        pageProps = await appContext.Component.getInitialProps(
          appContext.ctx,
          client,
          currentUser
        );
      }
      console.log("current user for landing from __app: ", pageProps);
      return { pageProps, currentUser }; // Return currentUser properly
    })
    .catch((err) => {
      console.error("Error fetching current user:", err.message);
      return { pageProps: {}, currentUser: null }; // Ensure pageProps is returned even on error
    });
};

export default AppComponent;

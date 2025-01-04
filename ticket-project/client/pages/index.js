import buildClient from "../api/build-client";

const Landing = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};
//contecst -> add in addition headers and others props from the browser
Landing.getInitialProps = async (context) => {
  return {};
};

export default Landing;

const Landing = ({ currentUser }) => {
  console.log(currentUser);
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};
//context -> add in addition headers and others props from the browser
Landing.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default Landing;

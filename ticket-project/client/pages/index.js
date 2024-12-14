import buildClient from '../api/build-client';

const Landing = ({currentUser}) => {
    
    return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}
//contecst -> add in addition headers and others props from the browser
Landing.getInitialProps = async (context) => {
    //console.log(context.req ? context.req.headers : 'No headers');
    console.log("Landing page");
    return buildClient(context)
        .get('/api/users/currentuser')
        .then((res) => res.data) // Extract and return the data
        .catch((err) => {
            console.error('Error fetching current user on landing page');
            return { currentUser: null }; // Fallback response
        });
    // let response;
    // try {
    //     const client = buildClient(context);
    //     const res = await client.get('/api/users/currentuser');
    //     response = res.data;
    // } catch (err) {
    //     console.error('Error fetching current user:', err);
    //     response = { currentUser: null };
    // }
    // return response;
};

export default Landing;
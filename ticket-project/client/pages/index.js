import buildClient from '../api/build-client';

const Landing = ({currentUser}) => {
    console.log(currentUser);
    return <h1>Landing page new one</h1>
}

Landing.getInitialProps = async (context) => {
    console.log(context.req ? context.req.headers : 'No headers');
  
    return buildClient(context)
        .get('/api/users/currentuser')
        .then((res) => res.data) // Extract and return the data
        .catch((err) => {
            console.error('Error fetching current user:', err);
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
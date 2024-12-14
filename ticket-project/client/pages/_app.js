import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';

const AppComponent =  ({ Component, pageProps }) => {
    return (
        <div><Component {...pageProps}/></div>)
}

AppComponent.getInintialProps = async ( appContext) => {
    console.log(Ogject.keys(appContext));
    const client = buildClient(appContext.ctx);

    console.log(appContext.ctx.req ? appContext.ctx.req.headers : 'No headers');
  
    return buildClient(appContext.ctx)
        .get('/api/users/currentuser')
        .then((res) => res.data) // Extract and return the data
        .catch((err) => {
            console.error('Error fetching current user:', err);
            return { currentUser: null }; // Fallback response
        });
}

export default AppComponent;
import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent =  ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component {...pageProps}/></div>)
}
AppComponent.getInitialProps = async (appContext) => {
    console.log("AppComponent running...");
    console.log(appContext.ctx.req ? "Running on server" : "Running on client");
    
    return buildClient(appContext.ctx)
        .get('/api/users/currentuser')
        .then(async (res) => {
            console.log("Fetched data:", res.data);
            let pageProps = {}
            if (appContext.Component.getInitialProps) { //handling case whan you use singin page and signup page that dont have getInitProps
                pageProps = await appContext.Component.getInitialProps(appContext.ctx);//manually call landing page
            }
            console.log("current user for landing from __app: ", pageProps);
            return {pageProps, ...res.data};
        })
        .catch((err) => {
            console.error("Error fetching current user:");
            return { currentUser: null }; // Fallback response
        });
};



export default AppComponent;
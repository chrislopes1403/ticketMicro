import 'bootstrap/dist/css/bootstrap.css';
import Build_Client_Axios from './../api/build-client';
import Header from './../components/Header';

const app = ({Component,pageProps,currentUser}) =>
{
    return (<div>
                <Header currentUser={currentUser}/>
                <div className="container">
                <Component currentUser={currentUser} {...pageProps}/>
                </div>
            </div>);
};



//appContext:{AppTree,Component,ctx,router}
//since we are calling getInitial props in app it will not be called anywhere else 
// so we must configure getInitialProps form the app and other pages
app.getInitialProps= async(appContext)=>
{
   const client_Axios = Build_Client_Axios(appContext.ctx);
   const {data} = await client_Axios.get('/api/users/currentuser');

   let pageProps = {};

    if(appContext.Component.getInitialProps)
    {
        // to get client_axios and current user in the getinitalprops function not the component
         pageProps = await appContext.Component.getInitialProps(appContext.ctx,client_Axios,data.currentUser);
    }

   return {
       pageProps,
       ...data,//currentUser:data.currentUser
   };
}



export default app;
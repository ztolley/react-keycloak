import React, { useEffect } from 'react';
import { useKeycloakContext } from './keycloakContext';



interface ProtectedRouteProps {
  /**
   * ( react-router or reach router ) route component
   */
  RouteComponent: any;
  /**
   * the route path
   */
  path: string;
  /**
   * if not defined we will use reach router logic
   */
  ComponentToRender?: any;
}


function ProtectedRoute({RouteComponent, path, ComponentToRender, ...rest}:ProtectedRouteProps){

    const {keycloak, authenticated, loginOptions, initOptions, loadingComponent} = useKeycloakContext();

    if(loadingComponent === undefined) {
      throw new Error('You must provide the loadingComponent props to the KeycloakProvider when using the ProtectedRoute')
    }

    useEffect(function(){
      if(!authenticated){
        //@ts-ignore
        keycloak.init(initOptions).then(function(success : boolean) {        
            if(!success){
              keycloak.login(loginOptions);
            }     
        });
      }
    // eslint-disable-next-line 
    }, []);

    if(authenticated) 
      return !ComponentToRender ? <RouteComponent path={path} {...rest}/> : <RouteComponent path={path} component={ComponentToRender}/>
    
    return loadingComponent;
    
}

export default ProtectedRoute;
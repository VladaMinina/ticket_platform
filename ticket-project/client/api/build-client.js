import axios from 'axios';

export default ({req}) => {
    if(typeof window === 'undefined'){
        //on server, need comunicate between servers and 
        //send request thrue ingress+namespace issues
        //http://SERVICENAME.NAMESPACE.svc.cluster.local
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.svc.cluster.local',
            headers: req.headers //the same as headers:{Host: 'ticketing.dev'}
        })
    } else {
        //on browser (use base url)
        return axios.create({
            baseURL: '/'
        }) 
    }
}
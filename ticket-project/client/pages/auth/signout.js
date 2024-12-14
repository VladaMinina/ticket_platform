import {useEffect} from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

export default () => {
    const {doRequest} = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    })

    useEffect(() => {
        //console.log("before do request in signout.js");
        doRequest();
        //console.log("after do request in signout.js");
    }, [])
    return <div>Signing out</div>
}
import React, { useReducer } from 'react';
import storeReducer from './storeReducer';
import storeContext from './storeContext';
import decode_token from '../utils';

const StoreProvider = ({ children }) => {

    const tokenFromStorage = localStorage.getItem('newsToken');
    const decoded = decode_token(tokenFromStorage);
    console.log('StoreProvider token:', tokenFromStorage);
    console.log('StoreProvider decoded:', decoded);

    const [store, dispatch] = useReducer(storeReducer,{
        userInfo: decoded,
        token: tokenFromStorage || ""
    })

    return <storeContext.Provider value={{store, dispatch}}> 
         {children}
    </storeContext.Provider>
     
};

export default StoreProvider;
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from 'universal-cookie'

const AuthRoute = (props) => {

    const cookies = new Cookies();

    const history = useHistory();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const checkUserToken = () => {
        const userToken = cookies.get('user-token');
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
            return history.push('/login');
        }
        setIsLoggedIn(true);
    }
    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);
    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}
export default AuthRoute;
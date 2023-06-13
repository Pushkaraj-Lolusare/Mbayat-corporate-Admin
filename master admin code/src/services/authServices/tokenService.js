import axiosConfig from "../../config/axiosConfig";
import Cookies from 'universal-cookie';

const url = 'users';

const verifyToken = async (data) => {

    const cookies = new Cookies();

    let getCookiesUser = null;
    if(cookies.get('user')){
        getCookiesUser = cookies.get('user');
    }
    const getUser = getCookiesUser;
    if(getUser !== null){
        const { id } = getUser;
        const apiCall = await axiosConfig.get(url + '/' + id).then(res => {
            if(res.status === 401){
                cookies.remove('user-token');
                cookies.remove('user');
            }
        }).catch((err) => {
            if(err?.response?.status === 401){
                cookies.remove('user-token');
                cookies.remove('user');
            }
            return { status: 'error', message: "Email or Password is incorrect",err:err.message };
        });
        return apiCall;
    }
    return true;
}

export default verifyToken;
import axiosConfig from "../../config/axiosConfig";
import Cookies from 'universal-cookie';

const url = 'auth/master-admin-login';
const loginService = async (data) => {

    const cookies = new Cookies();

    const apiCall = await axiosConfig.post(url,data).then(res => {
        if(res.status === 200){
            const { user,tokens } = res.data;

            cookies.set('user-token',tokens.access.token, { path:'/' });
            cookies.set('user', JSON.stringify(user), { path:'/' });

            return { status:'success', message: "Login successfully."}
        }else{
            return { status: 'error', message: "Email or Password is incorrect" };
        }
    }).catch((err) => {
        return { status: 'error', message: "Email or Password is incorrect",err:err.message };
    });
    return apiCall;
}

export default loginService;
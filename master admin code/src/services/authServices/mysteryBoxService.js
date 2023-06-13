import axiosConfig from "../../config/axiosConfig";
import Cookies from 'universal-cookie';

const url = 'auth';
export const getMysteryBoxSetting = async () => {
    const cookies = new Cookies();
    const userId = cookies.get('user').id;
    const apiCall = await axiosConfig.get(url + '/get-mystery-box-setting/' + userId).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message};
    });
    return apiCall;
}

export const updateMysteryBox = async (data) => {
    const apiCall = await axiosConfig.post(url + '/save-mystery-box-setting',data).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message};
    });
    return apiCall;
}
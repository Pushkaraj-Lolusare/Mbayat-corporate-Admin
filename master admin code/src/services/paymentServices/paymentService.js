import axiosConfig from "../../config/axiosConfig";

const url = 'payment';

export const paymentLists = async (page = 1, filter = null,) => {
    const limit = 10;
    const getPayments = await axiosConfig.get(url + '/all-payments',{
        params:{
            page,limit,
            ...filter,
        }
    }).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getPayments;
}

export const changePaymentStatus = async (data) => {
    const changeStatus = await axiosConfig.put(url + '/update-payment', data).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return changeStatus;
}

export const fetchAllPayments = async () => {
    const getPayments = await axiosConfig.get(url + '/get-all-payments').then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getPayments;
}
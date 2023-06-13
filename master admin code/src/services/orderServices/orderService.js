import axiosConfig from "../../config/axiosConfig";
import Cookies from "universal-cookie";

const url = 'order';

export const orderList = async (page = 1, filter = null,) => {
    const limit = 10;
    const getOrderList = await axiosConfig.get(url + '/all-order-lists',{
        params:{
            page,limit,
            ...filter
        }
    }).then(res => {
        if(res.status === 200){
            return res.data;
        }
        return { status: "error", message: "Order List not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getOrderList;
}

export const orderDetailById = async (orderId) => {
    const get = await axiosConfig.get(url +'/get-order-details/' + orderId).then((res) => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return get;
}

export const getUserOrderLists = async (userId, page = 1, filter = null) => {
    const limit = 10;
    const getOrderList = await axiosConfig.get(url + '/get-user-order-list/' + userId,{
        params:{
            page,limit,
            ...filter
        }
    }).then(res => {
        if(res.status === 200){
            return res.data;
        }
        return { status: "error", message: "Order List not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getOrderList;
}
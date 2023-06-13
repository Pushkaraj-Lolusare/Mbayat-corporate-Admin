import axiosConfig from "../../config/axiosConfig";

const url = 'plan';

export const createPlan = async (data) => {
    const add = await axiosConfig.post(url + '/create-plan', data).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return add;
}

export const getSubscriptionLists = async () => {
    const get = await axiosConfig.get(url + '/get-plan-lists').then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return get;
}

export const getSubscriptionById = async (id) => {
    const get = await axiosConfig.get(url + '/get-plan-by-id/' + id).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return get;
}

export const updatePlan = async (data) => {
    const add = await axiosConfig.post(url + '/update-plan', data).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return add;
}


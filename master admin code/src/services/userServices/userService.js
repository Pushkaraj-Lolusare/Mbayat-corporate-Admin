import axiosConfig from "../../config/axiosConfig";

const url = 'users';

export const userList = async (
    page = 1,
    limit = 10,
    interestId = "",
    userType = "",
    userGender = "",
    status= "",
    ) => {

    let finalParams = {
        page,
        limit,
        sortBy: 'createdAt:desc'
    };

    if(interestId){
        finalParams.interestId = interestId;
    }

    if(userType){
        finalParams.role = userType;
    }

    if(userGender){
        finalParams.gender = userGender;
    }

    if(status){
        finalParams.status = status;
    }


    const getUserList = await axiosConfig.get(url,{
        params: finalParams
    }).then(res => {
        if(res.status === 200){
            return res.data;
        }
        return { status: "error", message: "User List not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getUserList;
}

export const userDetails = async (userId) => {
    const getDetails = await axiosConfig.get(url + '/' + userId).then(res => {
        if(res.status === 200){
            return { status: 'success', data: res.data };
        }
        return { status: "error", message: "User not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getDetails;
}

export const updateUser = async (data,userId) => {
    const update = await axiosConfig.patch(url + '/update-user/' + userId,data).then(res => {
        if(res.status === 200){
            return { status: 'success', data: res.data };
        }
        return { status: "error", message: "User not updated." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return update;
}

export const deleteUser = async (userId) => {
    const remove = await axiosConfig.delete(url + '/' + userId).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return remove;
}

export const getDashboardData = async () => {
    const getDetails = await axiosConfig.get(url + '/get-dashboard-data').then(res => {
        if(res.status === 200){
            return { status: 'success', data: res.data };
        }
        return { status: "error", message: "Data not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getDetails;
}

export const getAllVendors = async (
    page = 1,
    limit = 10,
    interestId = "") => {
    let finalParams = {
        page,
        limit,
        role: 'vendor',
        status: 'active'
    };

    if(interestId){
        finalParams.interestId = interestId;
    }

    const getUserList = await axiosConfig.get('vendor-home/get-all-vendors',{
        params: finalParams
    }).then(res => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getUserList;
}

export const registerVendor = async (data) => {
    const register = await axiosConfig.post('vendor-auth/register-vendor',data).then((res) => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return register;
}

export const removeVendor = async (data) => {
    const remove = await axiosConfig.post('vendor-auth/remove-vendor', data).then((res) => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return remove;
}

export const getVendorDetails = async (vendorId) => {
    const get = await axiosConfig.get('vendor-auth/get-vendor-details/' + vendorId).then((res) => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return get;
}

export const updateVendorData = async (data) => {
    const update = await axiosConfig.post('vendor-auth/update-vendor-details',data).then((res) => {
        return res.data;
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return update;
}

export const getMysteryBoxForAdmin = async (filter = null) => {

    const get = await axiosConfig.get('vendor-order/get-mystery-box-for-admin',{
        params: filter,
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        return {status: 'error', message: err.message};
    });

    return get;
}

export const getAllMysteryBoxOrders = async (page,filter = null) => {
    const get = await axiosConfig.get('users/get-mystery-box-orders',{
        params: {
            ...filter,
            ...page,
        },
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        return {status: 'error', message: err.message};
    });

    return get;
}

export const getSubScriptionLists = async (userId,page) => {
    const get = await axiosConfig.get('subscription/get-user-subscription-lists/' + userId,{
        params: {
            page,
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        return {status: 'error', message: err.message};
    });

    return get;
}

export const getUserMysteryBoxData = async (uesrId,page = 1,filter = null) => {
    const get = await axiosConfig.get('users/users-mystery-boxes/' + uesrId,{
        params: {
            ...filter,
            ...page,
        },
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        return {status: 'error', message: err.message};
    });

    return get;
}
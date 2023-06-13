import axiosConfig from "../../config/axiosConfig";

const url = 'adminUser/';

export const adminUserList = async (page = 1, limit = 10) => {
    const getUserList = await axiosConfig.get(url + 'admin-user-list',{
        params:{
            page,limit,
            status: 'active'
        }
    }).then(res => {
        if(res.status === 200){
            return { status: 'success', data: res.data };
        }
        return { status: "error", message: "User List not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getUserList;
}

export const removeAdminUser = async (data) => {
    const removeUser = await axiosConfig.delete(url + 'delete-admin-user', {
        data: data
    }).then(res => {
        return res.data;
    }).catch(err => {
        return { status: 'error', message: err.message };
    });
    return removeUser;
}

export const addAdminUser = async (data) => {
    const add = await axiosConfig.post(url + 'add-admin-user',data).then(res => {
        return res.data;
    }).catch((err) => {
        return {
            status: 'error',
            message: err.response?.data?.message || err.message
        }
    });

    return add;
}

export const editAdminUser = async (data) => {
    const edit = await axiosConfig.post(url + 'edit-admin-user',data).then(res => {
        return res.data;
    }).catch((err) => {
        return {
            status: 'error',
            message: err.message
        }
    });

    return edit;
}
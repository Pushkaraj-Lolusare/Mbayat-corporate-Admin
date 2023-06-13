import axiosConfig from "../../config/axiosConfig";

const url = 'interest/';

export const interestLists = async (page = 1, limit = 10, fetchType = "") => {
    const getList = await axiosConfig.get(url + 'interest-lists',{
        params:{
            page,limit,fetchType
        }
    }).then(res => {
        if(res.status === 200){
            return res.data;
        }
        return { status: "error", message: "Interest List not found." }
    }).catch((err) => {
        return { status: "error", message: err.message }
    });

    return getList;
}

export const addInterest = async (data) => {
    const add = await axiosConfig.post(url + '/create-interest',data).then((res) => {
        return res.data;
    }).catch(err => {
        return { status: "error", message: err.message }
    });

    return add;
}

export const addSubInterest = async (data) => {
    const add = await axiosConfig.post(url + '/create-sub-interest',data).then((res) => {
        return res.data;
    }).catch(err => {
        return { status: "error", message: err.message }
    });

    return add;
}

export const getSubInterest = async (interestId) => {

    const get = await axiosConfig.get(url + 'sub-interest-by-id/' + interestId).then((res) => {
        return res.data;
    }).catch(err => {
        return { status: "error", message: err.message }
    });

    return get;
}

export const updateInterest = async (data) => {
    const update = await axiosConfig.put(url + '/update-interest',data).then((res) => {
        return res.data;
    }).catch(err => {
        return { status: "error", message: err.message }
    });

    return update;
}

export const removeInterest = async (data) => {
    const remove = await axiosConfig.delete(url + 'delete-interest',{
        data: data
    }).then((res) => {
        return res.data;
    }).catch(err => {
        return { status: "error", message: err.message }
    });

    return remove;
}

export const getUserByInterest = async (interestId, page, filter = null) => {
    const limit = 10;
    const get = axiosConfig.get(url + 'get-user-by-interest/' + interestId,{
        params:{
            page,limit,
            ...filter
        }
    }).then(res => {
        return res.data;
    }).catch(err => {
        return { status: "error", message: err.message }
    });

    return get;
}
import axiosConfig from "../../config/axiosConfig";

const url = 'rating';

export const ratingList = async (page = 1, filter = null,) => {
    const limit = 10;
    const getOrderList = await axiosConfig.get(url + '/get-all-review-lists',{
        params:{
            page,limit,
            ...filter,
            populate: "userId"
        }
    }).then(res => {
        if(res.status === 200){
            return res.data;
        }
        return { status: "error", message: "Rating List not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getOrderList;
}
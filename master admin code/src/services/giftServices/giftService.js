import axiosConfig from "../../config/axiosConfig";

const url = 'gift';

export const giftLists = async (page = 1, filter = null,) => {
    const limit = 10;
    const getGifts = await axiosConfig.get(url + '/get-all-gift-history',{
        params:{
            page,limit,
            ...filter,
            populate: "giftSenderUserId,giftReceiverUserId, giftSubscriptionId"
        }
    }).then(res => {
        if(res.status === 200){
            return res.data;
        }
        return { status: "error", message: "Payment List not found." }
    }).catch((err) => {
        return { status: 'error', message: err.message };
    });

    return getGifts;
}
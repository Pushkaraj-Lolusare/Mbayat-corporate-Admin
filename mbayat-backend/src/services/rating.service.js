const { Rating } = require("../models");

const addRatingToProduct = async (reqBody) => {
  const addRating = await Rating.create(reqBody);
  if (addRating) {
    return {
      status: "success",
      message: "Rating added to product successfully.",
    };
  }
  return {
    status: "failed",
    message:
      "Something went wrong while adding rating to product, Please try again or later.",
  };
};

const getRatingByUser = async (userId) => {
  return Rating.find({ userId })
    .populate("userId")
    .then((res) => {
      if (res.length > 0) {
        return {
          status: "success",
          message: "Your all rating list",
          data: res,
        };
      }
      return {
        status: "failed",
        message: "You haven't added any ratings yet.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });
};

const getRatingByProduct = async (productId) => {
  return Rating.find({ productId })
    .populate(["userId", "productId"])
    .then((res) => {
      if (res.length > 0) {
        return {
          status: "success",
          message: "Product All ratting list.",
          data: res,
        };
      }
      return {
        status: "failed",
        message: "You haven't added any ratings yet.",
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message,
      };
    });
};

const getAllRatingList = async (filter, options) => {
  const getAll = await Rating.paginate(filter, options);
  return {
    status: "success",
    message: "All rating list",
    data: getAll,
  };
};

const editRating = async (reqBody) => {
  const { userId, reviewId, rating, review } = reqBody;
  const updateRating = await Rating.updateOne(
    {
      _id: reviewId,
      userId,
    },
    {
      rating,
      review,
    }
  );
  if (updateRating) {
    return {
      status: "success",
      message: "Review updated successfully.",
    };
  }
  return {
    status: {
      status: "failed",
      message: "Submission of review failed. Please try again later.",
    },
  };
};

const deleteRating = async (reqBody) => {
  const { userId, reviewId } = reqBody;
  const removeReview = await Rating.deleteOne({
    _id: reviewId,
    userId,
  });
  if (removeReview) {
    return {
      status: "success",
      message: "Review deleted successfully.",
    };
  }
  return {
    status: {
      status: "failed",
      message: "Something went wrong while deleting review.",
    },
  };
};

module.exports = {
  addRatingToProduct,
  getRatingByUser,
  getRatingByProduct,
  getAllRatingList,
  editRating,
  deleteRating,
};

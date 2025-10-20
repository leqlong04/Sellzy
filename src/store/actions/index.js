import toast from "react-hot-toast";
import api from "../../api/api";

export const fetchProducts = (queryString) => async (dispatch) => {

    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        })
        dispatch({ type: "FETCH_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "FETCH_ERROR",
            payload: error?.response?.data?.message || "Something went wrong"
        });
    }
};


export const addToCart = (data, qty = 1, toast) => (dispatch, getState) => {

    const { products } = getState().products;
    const getProduct = products.find(item => item.productId === data.productId);

    // Check for stock
    const isQuantityExisted = getProduct.quantity >= qty;

    if (isQuantityExisted) {
        dispatch({
            type: "ADD_TO_CART",
            payload: { ...data, quantity: qty }
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        toast.success(`${data.productName} added to cart!`);
    }
    else {
        toast.error(`${data.productName} is out of stock!`);

    }

};

export const increaseCartQuantity =
    (data, toast, currentQuantity, setCurrentQuantity) =>
        (dispatch, getState) => {
            const { products } = getState().products;
            const getProduct = products.find(
                (item) => item.productId === data.productId
            );

            const isQuantityExist = getProduct.quantity >= currentQuantity + 1;

            if (isQuantityExist) {
                const newQuantity = currentQuantity + 1;
                setCurrentQuantity(newQuantity);

                dispatch({
                    type: "ADD_TO_CART",
                    payload: { ...data, quantity: newQuantity + 1 },
                });
                localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
            } else {
                toast.error("Quantity reached to limit");
            }
        };

export const decreaseCartQuantity =
    (data, newQuantity) => (dispatch, getState) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: { ...data, quantity: newQuantity },
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));

    }

export const removeFromCart =
    (data, toast) => (dispatch, getState) => {
        dispatch({ type: "REMOVE_CART", payload: data });
        toast.success(`${data.productName} remove from cart`);
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }
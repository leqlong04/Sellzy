const initialState = {
    cart: [],
    totalPrice: 0,
    cartId: null,
}

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            const item = action.payload;
            const existItem = state.cart.find(x => x.productId === item.productId);
            if (existItem) {
                const updatedCart = state.cart.map((x) => {
                    if (x.productId === item.productId) {
                        return item;
                    }
                    else {
                        return x;
                    }
                });

                return {
                    ...state,
                    cart: updatedCart
                }
            }
            else {
                const newCart = [...state.cart, item];
                return {
                    ...state,
                    cart: newCart
                };
            }

        case "REMOVE_CART":
            return {
                ...state,
                cart: state.cart.filter(
                    (item) => item.productId != action.payload.productId
                )
            };
        case "GET_USER_CART_PRODUCTS":
            return {
                ...state,
                cart: action.payload,
                totalPrice: action.totalPrice,
                cartId: action.cartId,
            };
        case "CLEAR_CART":
            return {
                cart: [],
                totalPrice: 0,
                cartId: null
            };
        default:
            return state;

    }
    return state;
}

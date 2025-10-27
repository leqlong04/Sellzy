import { useState } from "react";
import { MdDelete } from "react-icons/md";
import SetQuantity from "./SetQuantity";
import { useDispatch } from "react-redux";
import { decreaseCartQuantity, increaseCartQuantity, removeFromCart } from "../../store/actions";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";
import getImageUrl from "../../utils/getImageUrl";

const ItemContent = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    cartId

}) => {
    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    const dispatch = useDispatch();

    const handleQtyIncrease = (cartItems) => {
        dispatch(increaseCartQuantity(
            cartItems,
            toast,
            currentQuantity,
            setCurrentQuantity
        ));
    };

    const handleQtyDecrease = (cartItems) => {
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            setCurrentQuantity(newQuantity);
            dispatch(decreaseCartQuantity({ ...cartItems, quantity: newQuantity }));
        }
    };

    const removeItemFromCart = (cartItems) => {
        dispatch(removeFromCart(cartItems, toast));
    };

    return (
        <div className="grid md:grid-cols-5 grid-cols-4 gap-4 py-4 border-b border-slate-200 items-center">
            <div className="md:col-span-2 flex gap-4 items-center">
                <div className="md:w-36 sm:w-24 w-20 flex-shrink-0">
                    <img 
                        src={getImageUrl(image)} 
                        alt={productName} 
                        className="w-full h-auto object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                            e.target.src = '/placeholder.svg';
                        }}
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <h3 className="lg:text-[17px] text-sm font-semibold text-slate-800">
                        {productName}
                    </h3>
                    
                    <button
                        onClick={() => removeItemFromCart({
                            image,
                            productName,
                            description,
                            specialPrice,
                            price,
                            productId,
                            quantity,
                        })}
                        className="flex items-center font-semibold space-x-2 px-3 py-1.5 text-xs border border-rose-600 text-rose-600 rounded-md hover:bg-rose-600 hover:text-white transition duration-300 w-fit">
                        <MdDelete size={16} />
                        <span>Remove</span>
                    </button>
                </div>
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-800 font-bold">
                {formatPrice(Number(specialPrice))}
            </div>

            <div className="justify-self-center">
                <SetQuantity
                    quantity={currentQuantity}
                    cardCounter={true}
                    handleQtyIncrement={() => handleQtyIncrease({
                        image,
                        productName,
                        description,
                        specialPrice,
                        price,
                        productId,
                        quantity,
                    })}
                    handleQtyDecrement={() => handleQtyDecrease({
                        image,
                        productName,
                        description,
                        specialPrice,
                        price,
                        productId,
                        quantity,
                    })}
                />
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-800 font-bold">
                {formatPrice(Number(currentQuantity) * Number(specialPrice))}
            </div>
        </div>
    )
}

export default ItemContent;
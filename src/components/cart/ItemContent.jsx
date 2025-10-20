import { MdDelete } from "react-icons/md";
import SetQuantity from "./SetQuantity";
import { useDispatch } from "react-redux";
import { decreaseCartQuantity, increaseCartQuantity, removeFromCart } from "../../store/actions";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";

const ItemContent = (productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,) => {
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
            dispatch(decreaseCartQuantity(cartItems, newQuantity));
        }
    };

    const removeItemFromCart = (cartItems) => {
        dispatch(removeFromCart(cartItems, toast));
    };

    return (
        <div>
            <div>
                <div>
                    <h3 className="lg:text-[17px] text-sm font-semibold">
                        {productName}
                    </h3>
                </div>

                <div className="md:w-36 sm:w-24 w-12">
                    <img src={image} alt={productName} className="md:h-36 sm:h-24 w-full object-cover" />
                </div>

                <div className="flex items-start gap-5 mt-3">
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
                        className="flex items-center font-semibold space-x-2 px-4 py-1 text-xs border border-rose-600 text-rose-600 rounded-md hover:bg-red-300 hover:text-white transition duration-300">
                        <MdDelete size={16} />
                        Remove

                    </button>

                </div>
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-800 font-extrabold">
                {formatPrice(Number(specialPrice))}

            </div>

            <div className="justify-self-center ">
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

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-800 font-extrabold">
                {formatPrice(Number(currentQuantity) * Number(specialPrice))}
            </div>


        </div>
    )
}
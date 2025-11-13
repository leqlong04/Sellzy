

const SetQuantity = ({
    quantity,
    cardCounter,
    handleQtyIncrement,
    handleQtyDecrement
}) => {
    return (
        <div className="flex items-center space-x-2">
            {cardCounter ? null : <div className="font-semibold">Quantity</div>}
            <div className="flex md:flex-row flex-col gap-4 items-center">
                <button
                    disabled={quantity <= 1}
                    onClick={handleQtyDecrement}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300">
                    -
                </button>

                <div className="text-red-500">{quantity}</div>

                <button
                    onClick={handleQtyIncrement}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition duration-300"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default SetQuantity;
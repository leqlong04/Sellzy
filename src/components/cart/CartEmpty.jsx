import { Link } from "react-router-dom";
import { MdShoppingCart, MdArrowBack } from "react-icons/md";

const CartEmpty = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                        <MdShoppingCart size={64} className="text-gray-400" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Your Cart is Empty
                </h2>
                
                <p className="text-gray-600 mb-8">
                    Looks like you haven't added anything to your cart yet.
                    Start shopping to fill it up!
                </p>
                
                <Link 
                    to="/products" 
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                    <MdArrowBack size={20} />
                    Start Shopping
                </Link>
                
                <Link 
                    to="/" 
                    className="inline-block mt-4 text-sm text-gray-500 hover:text-purple-600 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default CartEmpty;
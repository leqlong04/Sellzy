import { FaBoxOpen, FaComments, FaHome, FaShoppingCart, FaStore, FaThList, FaChartBar } from "react-icons/fa";

export const adminNavigation = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: FaHome,
        current: true
    }, {
        name: "Orders",
        href: "/admin/orders",
        icon: FaShoppingCart
    }, {
        name: "Products",
        href: "/admin/products",
        icon: FaBoxOpen
    }, {
        name: "Categories",
        href: "/admin/categories",
        icon: FaThList
    }, {
        name: "Sellers",
        href: "/admin/sellers",
        icon: FaStore
    }
];


export const sellerNavigation = [
    {
        name: "Orders",
        href: "/admin/orders",
        icon: FaShoppingCart,
        current: true
    }, {
        name: "Products",
        href: "/admin/products",
        icon: FaBoxOpen
    }, {
        name: "Statistics",
        href: "/admin/statistics",
        icon: FaChartBar
    }, {
        name: "Messages",
        href: "/admin/messages",
        icon: FaComments
    }
];

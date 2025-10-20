const Status = ({ text, icon: Icon, bg, color }) => {
    return (
        <div
            className={`${bg} ${color} px-3 py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 w-fit shadow-sm border border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md`}
        >
            {text} <Icon size={16} className="drop-shadow-sm" />
        </div>
    )
}

export default Status
const truncateText = (text, charLimit = 10) => {
    if (!text) return "";
    if (text.length <= charLimit) {
        return text;
    }
    return text.slice(0, charLimit) + "...";
};

export default truncateText;
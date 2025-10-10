const truncateText = (text, charLimit = 90) => {
    if (text?.length <= charLimit) {
        return text;
    }
    return text.slice(0, charLimit) + "...";
};

export default truncateText;
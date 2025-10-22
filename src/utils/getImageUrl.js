export default function getImageUrl(imageName) {
    if (!imageName) return "/placeholder.svg";

    const base = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";
    if (String(imageName).startsWith("http")) return imageName;

    const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${baseClean}/images/${imageName}`;
}



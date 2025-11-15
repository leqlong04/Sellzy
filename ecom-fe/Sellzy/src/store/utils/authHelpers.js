export const extractJwtFromCookie = (cookieValue) => {
  if (!cookieValue) return null;
  const firstPart = cookieValue.split(";")[0];
  const separatorIndex = firstPart.indexOf("=");
  if (separatorIndex === -1) {
    return firstPart.trim();
  }
  return firstPart.substring(separatorIndex + 1).trim();
};


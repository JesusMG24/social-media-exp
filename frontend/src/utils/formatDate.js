export function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};
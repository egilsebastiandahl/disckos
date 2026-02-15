export const dateStringToDateTimeFormatter = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("no", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
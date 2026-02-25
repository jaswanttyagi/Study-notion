
export const formattedDate = (date) => {
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) return "N/A"

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

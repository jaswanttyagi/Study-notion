function convertSecondsToDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Number.parseInt(totalSeconds, 10) || 0)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  if (hours > 0) {
    return seconds > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${hours}h ${minutes}m`
  }

  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`
  }

  return `${seconds}s`
}

module.exports = convertSecondsToDuration;



export default function timestampAgo(bigIntTimestamp) {

    // Convert BigInt timestamp to milliseconds
    const ts = Number(bigIntTimestamp / 1_000_000n);

    // Create Date objects
    const now = new Date();
    const pastDate = new Date(ts);

    // Calculate the difference in milliseconds
    const difference = now - pastDate;

    // Convert the difference to various units
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate months
    const years = Math.floor(days / 365); // Approximate years


    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago)`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

// Example usage


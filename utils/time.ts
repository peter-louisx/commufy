export const convertSecondIntoMinute = (seconds: number) => {
    if(seconds < 60) return `${seconds} seconds`;

    const minutes = Math.floor(seconds / 60);


    return `${minutes} minutes`;
}
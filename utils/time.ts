export const convertSecondIntoMinute = (seconds: number) => {
    if(seconds < 60) return `${seconds} seconds`;

    const minutes = Math.floor(seconds / 60);


    return `${minutes} minutes`;
}

export const convertDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  export const convertTimeToString = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}:00`;
  };
  
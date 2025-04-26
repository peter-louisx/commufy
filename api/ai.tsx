import axios from "./axios";

export const AIAPI = {
  async predictTime({
    age,
    weight,
    height,
    sex,
    speed = 1.4,
  }: {
    age: number;
    weight: number;
    height: number;
    sex: string;
    speed: number;
  }) {
    return await axios.post(`https://commufy-ai-production.up.railway.app/`, {
      age,
      weight,
      height,
      sex,
      speed,
    });
  },
};

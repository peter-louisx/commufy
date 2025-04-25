import React from "react";
import Svg, { SvgProps, Path, Circle, G } from "react-native-svg";

type IconsProps = "Home" | "Map" | "MuRoute" | "User" | "Notification";

const Icons: Record<
  IconsProps,
  ({ size, color }: { size: number; color: string }) => JSX.Element
> = {
  Home: ({ size = 24, color = "black" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        stroke="#FAFAFA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9 22V12H15V22"
        stroke="#FAFAFA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  ),
  Map: ({ size = 24, color = "black" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M8 2V18"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M16 6V22"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  ),
  MuRoute: ({ size = 24, color = "black" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M3 11L22 2L13 21L11 13L3 11Z"
        stroke="#FAFAFA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  ),
  User: ({ size = 24, color = "black" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke="#FAFAFA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        stroke="#FAFAFA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  ),
  Notification: ({ size = 24, color = "black" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.0199 2C8.3399 2 5.3599 4.98 5.3599 8.66V10.76C5.3599 11.44 5.0799 12.46 4.7299 13.04L3.4599 15.16C2.6799 16.47 3.2199 17.93 4.6599 18.41C9.4399 20 14.6099 20 19.3899 18.41C20.7399 17.96 21.3199 16.38 20.5899 15.16L19.3199 13.04C18.9699 12.46 18.6899 11.43 18.6899 10.76V8.66C18.6799 5 15.6799 2 12.0199 2Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <Path
        d="M15.3299 18.8199C15.3299 20.6499 13.8299 22.1499 11.9999 22.1499C11.0899 22.1499 10.2499 21.7699 9.64992 21.1699C9.04992 20.5699 8.66992 19.7299 8.66992 18.8199"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
      />
    </Svg>
  ),
};

export default Icons;

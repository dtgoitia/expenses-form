import { unreachable } from "../lib/devex";

export type IconName = "arrow-left" | "bin" | "gear" | "pencil" | "rotate";
export type IconSize = "small" | "large" | "extralarge";
type SvgViewBox = string; // coordinates as they look in the SVG "viewBox" attribute, e.g.: `0 0 120 140`

interface Props {
  icon: IconName;
  size?: IconSize;
}

const DEFAULT_ICON_SIZE: IconSize = "small";
const INHERIT_COLOR_FROM_PARENT = { fill: "currentColor" };

function getSvgContent({
  icon,
}: {
  icon: IconName;
}): [SvgViewBox, JSX.Element | JSX.Element[]] {
  switch (icon) {
    case "arrow-left":
      return [
        "0 0 512 512",
        <path
          {...INHERIT_COLOR_FROM_PARENT}
          d="M 475,219.46 H 125 L 245,99 A 36.7,36.7 0 0 0 193.33,47.33 L 10.6,230 a 37.1,37.1 0 0 0 0,52 L 193.3,464.7 a 36.7,36.7 0 0 0 51.9,-51.9 L 125,292 h 350.47 c 20.1,0 36.55,-16.45 36.55,-36.55 0,-20.1 -16.8,-36.55 -36.9,-36.55 z"
        />,
      ];
    case "bin":
      return [
        "0 0 16 16",
        [
          <path
            {...INHERIT_COLOR_FROM_PARENT}
            d={
              "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1z" +
              "M4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.8824zM2.53h11V2h-11z"
            }
          />,
          <path
            {...INHERIT_COLOR_FROM_PARENT}
            d={
              "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5" +
              "m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5" +
              "m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
            }
          />,
        ],
      ];
    case "gear":
      return [
        "0 0 512 512",
        <path
          {...INHERIT_COLOR_FROM_PARENT}
          d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
        />,
      ];
    case "rotate":
      return [
        "0 0 512 512",
        <path
          {...INHERIT_COLOR_FROM_PARENT}
          d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
        />,
      ];

    default:
      throw unreachable(`unsupported icon '${icon}'`);
  }
}

function getDimensions({ size }: { size: IconSize }): { width: string; height: string } {
  switch (size) {
    case "small":
      return { width: "0.9rem", height: "0.9rem" };
    case "large":
      return { width: "1.2rem", height: "1.2rem" };
    case "extralarge":
      return { width: "1.5rem", height: "1.5rem" };
    default:
      throw unreachable(`unsupported size '${size}'`);
  }
}

export function Icon({ icon, size }: Props) {
  const { width, height } = getDimensions({ size: size || DEFAULT_ICON_SIZE });
  const [viewBox, content] = getSvgContent({ icon });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="fill-current"
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      width={width}
      height={height}
      role="icon"
    >
      {content}
    </svg>
  );
}

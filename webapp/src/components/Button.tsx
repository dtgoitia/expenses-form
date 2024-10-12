import { Icon, IconName, IconSize } from "./Icon";
import { MouseEventHandler } from "react";

interface Props {
  /** Text to show inside the button. */
  text: string;

  /** If true, the icon cannot be clicked by the user. */
  disabled?: boolean;

  /** Optional icon to display. */
  icon?: IconName;

  /** Optional icon to display. Requires `icon` property. */
  iconSize?: IconSize;

  /** Click event handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({ text, disabled, icon, iconSize, onClick }: Props) {
  const baseCss =
    "   dark:bg-gray-700   bg-gray-300" +
    " dark:text-gray-300 text-gray-700" +
    " py-2 px-3" +
    " rounded" +
    " inline-flex items-center";
  const hoverCss = " hover:bg-gray-400";
  const disabledCss = " opacity-50 cursor-not-allowed";
  let css = baseCss;
  if (disabled) {
    css += disabledCss;
  } else {
    css += hoverCss;
  }

  let props = {};
  if (iconSize) {
    props = { size: iconSize };
  }

  return (
    <button className={css} disabled={disabled} onClick={onClick}>
      {icon && <Icon icon={icon} {...props} />}
      <span>{text}</span>
    </button>
  );
}

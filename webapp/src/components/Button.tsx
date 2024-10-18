import { Icon, IconName, IconSize } from "./Icon";
import { MouseEventHandler } from "react";

interface Props {
  /** Text to show inside the button. */
  text?: string;

  /** If the button is active or not */
  active?: boolean;

  /** If true, the icon cannot be clicked by the user. */
  disabled?: boolean;

  /** Optional icon to display. */
  icon?: IconName;

  /** Optional icon to display. Requires `icon` property. */
  iconSize?: IconSize;

  /** Click event handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({ text, active, disabled, icon, iconSize, onClick }: Props) {
  const baseCss =
    "text-sm" + " py-2 px-3" + " rounded" + " inline-flex items-center gap-2";
  const normalCss = " bg-gray-300  dark:bg-gray-600  text-gray-700  dark:text-gray-300"; // not active, not disabled
  const hoverCss =
    " hover:text-gray-100  hover:dark:text-gray-800" +
    "   hover:bg-gray-400    hover:dark:bg-gray-400";
  const activeCss = " bg-gray-400  dark:bg-gray-400  text-gray-100  dark:text-gray-800";
  const disabledCss = " opacity-50 cursor-not-allowed";
  let css = baseCss;

  if (disabled) {
    css += disabledCss;
  } else {
    css += hoverCss;

    if (active) {
      css += activeCss;
    } else {
      css += normalCss;
    }
  }

  let props = {};
  if (iconSize) {
    props = { size: iconSize };
  }

  return (
    <button className={css} disabled={disabled} onClick={onClick}>
      {icon && <Icon icon={icon} {...props} />}
      {text !== undefined && <span>{text}</span>}
    </button>
  );
}

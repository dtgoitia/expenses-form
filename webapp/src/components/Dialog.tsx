import { ReactNode } from "react";

interface Props {
  /**
   * Dialog content.
   */
  children: ReactNode;

  /**
   * Custom CSS classes added to the `<dialog>` element.
   */
  className?: string;

  /**
   * If `true`, the dialog is visible (open), otherwise is hidden (closed).
   */
  isOpen: boolean;

  /**
   * Function called when the user clicks outside the dialog.
   */
  onClickOutside: () => void;
}

export function Dialog({ children, className, isOpen, onClickOutside }: Props) {
  let backdropCss = "z-10";

  let contentCss =
    "z-10" +
    " bg-gray-200 dark:bg-gray-700" +
    " text-gray-800 dark:text-gray-200" +
    " focus:outline-none"; // hide "focus" border
  if (className) {
    contentCss += ` ${className}`;
  }

  return (
    <>
      <Backdrop onClick={onClickOutside} isVisible={isOpen} className={backdropCss} />
      <dialog className={contentCss} open={isOpen}>
        {children}
      </dialog>
    </>
  );
}

interface BackdropProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

function Backdrop({ isVisible, onClick: click, className }: BackdropProps) {
  let css =
    "absolute" + " top-0  left-0  right-0  bottom-0" + " bg-gray-900" + " opacity-60";

  if (isVisible) {
    css += "";
  } else {
    css += " hidden";
  }

  if (className) {
    css += ` ${className}`;
  }

  return <div className={css} role="dialog-backdrop" onClick={click}></div>;
}

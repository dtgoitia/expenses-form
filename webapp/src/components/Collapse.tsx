import { ReactNode } from "react";

interface Props {
  /**
   * Content to collapse.
   */
  children: ReactNode | ReactNode[];

  /**
   * If `true`, the content is visible (open), otherwise the content is
   * hidden (collapsed).
   */
  isOpen: boolean;
}
export function Collapse({ children, isOpen }: Props) {
  const css = `
    overflow-hidden
    transition-all
    duration-300
    ease-in-out
    ${isOpen ? "" : "max-h-0"}
  `;
  return (
    <div className={css} role="collapse">
      {children}
    </div>
  );
}

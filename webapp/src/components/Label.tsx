import { ReactNode } from "react";

interface Props {
  htmlFor: string;
  text?: string;
  children: ReactNode | ReactNode[];
}
export function Label({ htmlFor, text, children }: Props) {
  return (
    <label className="text-gray-600  dark:text-gray-400" htmlFor={htmlFor}>
      {text}
      {children}
    </label>
  );
}

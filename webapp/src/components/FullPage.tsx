import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

function Parent({ children, className }: Props) {
  return <div className={`h-screen ${className}`}>{children}</div>;
}

function Content({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}

function ContentFullyCentered({ children, className }: Props) {
  return (
    <div className={`h-screen flex flex-col flex-nowrap justify-center ${className}`}>
      {children}
    </div>
  );
}

export const FullPage = { Parent, Content, ContentFullyCentered };

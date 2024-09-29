import { Icon, IconName } from "./Icon";
import { MouseEventHandler } from "react";
import styled from "styled-components";

interface Props {
  /** Text to show inside the button. */
  text: string;

  /** If true, the icon cannot be clicked by the user. */
  disabled?: boolean;

  /** Optional icon to display. */
  icon?: IconName;

  /** Click event handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const VERTICAL_PADDING = 0.5; // 'rem' units
const HORIZONTAL_PADDING = 1.6 * VERTICAL_PADDING; // relative to vertical padding

const StyledButton = styled.button`
  &:hover {
    cursor: pointer;
  }
`;

const VerticallyCenteredIcon = styled(Icon)`
  display: block;
  align-self: center;
`;

export function Button({ text, disabled, icon, onClick }: Props) {
  return (
    <StyledButton
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        paddingTop: `${VERTICAL_PADDING}rem`,
        paddingBottom: `${VERTICAL_PADDING}rem`,
        paddingLeft: `${HORIZONTAL_PADDING}rem`,
        paddingRight: `${HORIZONTAL_PADDING}rem`,

        color: "rgba(0, 0, 0, 0.87)",
        backgroundColor: "#f6f7f9",
        border: "none",
        boxShadow:
          "inset 0 0 0 1px rgba(17, 20, 24, 0.2), 0 1px 2px rgba(17, 20, 24, 0.1)",
        borderRadius: "2px",
        lineHeight: 1.15,

        flexWrap: "nowrap",
        alignItems: "center",
        columnGap: "0.4rem",

        alignSelf: "center",
      }}
    >
      {icon && (
        <span
          tabIndex={-1 /* prevent user from focusing this element by pressing Tab */}
          style={{
            order: 1,
            display: "inline-flex",
            flex: "0 0 auto",
            alignItems: "center",
          }}
        >
          <VerticallyCenteredIcon icon="rotate" size="small" />
        </span>
      )}
      <span style={{ order: 2 }}>{text}</span>
    </StyledButton>
  );
}

import React from "react";
import styled from "styled-components";
import color from "../styles/color";

interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  size?: "small" | "medium" | "large";
  label: string;
  onClick?: () => void;
}

export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? "color-primary" : "color-secondary";
  return (
    <StyledButton
      type="button"
      className={[`size-${size}`, mode].join(" ")}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  font-weight: 700;
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  line-height: 1;

  &.color-primary {
    color: ${color.white};
    background-color: ${color.blue};
  }
  &.color-secondary {
    color: ${color.black};
    background-color: transparent;
    box-shadow: rgba(0, 0, 0, 0.15) 0 0 0 1px inset;
  }
  &.size-small {
    font-size: 12px;
    padding: 10px 16px;
  }
  &.size-medium {
    font-size: 14px;
    padding: 11px 20px;
  }
  &.size-large {
    font-size: 16px;
    padding: 12px 24px;
  }
`;

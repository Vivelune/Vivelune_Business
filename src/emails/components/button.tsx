import { Button } from "@react-email/components";
import { globalStyles } from "./styles";

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const EmailButton = ({ href, children, style }: EmailButtonProps) => (
  <Button style={{ ...globalStyles.button, ...style }} href={href}>
    {children}
  </Button>
);
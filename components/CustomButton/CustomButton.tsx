import { LoadingButton } from "@mui/lab";

type Props = {
  disabled?: boolean;
  onClick: Function;
  text: string;
  variant?: "dark" | "light" | "grey";
  sx?: any;
  loading?: boolean;
};

export const CustomButton: React.FC<Props> = ({
  disabled,
  onClick,
  text,
  variant = "dark",
  sx,
  loading,
}) => {
  return (
    <LoadingButton
      loading={loading}
      sx={
        variant === "dark"
          ? {
              color: "white",
              background: "black",
              borderRadius: "16px",
              pt: 1.5,
              pb: 1.5,
              pl: 3,
              pr: 3,
              width: 200,
              fontSize: 14,
              fontWeight: 700,
              maxWidth: "90vw",
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.05)",
              "&:disabled": {
                fontWeight: 700,
                opacity: 0.1,
                color: "white",
              },
              "&:hover": {
                background: "#1C1C1E",
                fontWeight: 700,
              },
              textTransform: "none",
              ...sx,
            }
          : variant === "grey"
          ? {
              color: "#1C1C1E",
              background: "rgba(0,0,0,0.05)",
              borderRadius: "16px",
              pt: 1.5,
              pb: 1.5,
              pl: 3,
              pr: 3,
              width: "100%",
              maxWidth: "90vw",
              fontSize: 14,
              fontWeight: 400,
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.05)",
              "&:disabled": {
                color: "rgba(28, 28, 30, 0.3)",
                fontWeight: 300,
              },
              textTransform: "none",
              ...sx,
            }
          : {
              color: "#1C1C1E",
              background: "white",
              borderRadius: "16px",
              pt: 1.5,
              pb: 1.5,
              pl: 3,
              pr: 3,
              width: "100%",
              maxWidth: "90vw",
              fontSize: 14,
              fontWeight: 300,
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.05)",
              "&:disabled": {
                color: "rgba(28, 28, 30, 0.3)",
                fontWeight: 700,
              },
              textTransform: "none",
              ...sx,
            }
      }
      disabled={!!disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {text}
    </LoadingButton>
  );
};

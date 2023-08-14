import { Stack, TextField, Typography } from "@mui/material";

type Props = {
  value: string;
  setValue: (v: string) => void;
  type: "text" | "password";
  placeholder: string;
  error?: string;
  setError?: (v: string) => void;
  onSubmit?: Function;
};

export const CustomTextField: React.FC<Props> = ({
  value,
  setValue,
  type,
  placeholder,
  error,
  setError,
  onSubmit,
}) => {
  return (
    <Stack direction="column" alignItems="center">
      <TextField
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            if (!!onSubmit) onSubmit();
          }
        }}
        sx={{
          color: "white",
          borderRadius: "16px",
          minWidth: 200,
          fontSize: 14,
          fontWeight: 300,
          mb: 1,
          boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.05)",
          "& fieldset": { border: "none" },
          "& .Mui-focused": {
            border: !!error ? "1px solid #BD0B00" : "1px solid #FF8600",
          },
          "& input::placeholder": {
            fontSize: 14,
          },
        }}
        value={value}
        onChange={(e) => {
          if (!!e.target.value && !!setError) setError("");
          setValue(e.target.value);
        }}
        type={type}
        label=""
        placeholder={placeholder}
        InputProps={{
          style: {
            borderRadius: "16px",
          },
        }}
        variant="outlined"
      />
      {!!error && (
        <Typography
          sx={{
            color: "#BD0B00",
          }}
          variant="bodySmall"
          fontWeight={300}
        >
          {error}
        </Typography>
      )}
    </Stack>
  );
};

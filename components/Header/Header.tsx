import { resetUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useState } from "react";

export const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  if (!user.jwt) return <></>;

  return (
    <Stack
      direction="column"
      alignItems="flex-end"
      gap={1}
      ref={(el) => setAnchorEl(el)}
      sx={{
        cursor: "pointer",
        zIndex: 1000,
        pt: 3,
        pr: 3,
        alignSelf: "flex-end",
      }}
      onClick={() => {
        if (openMenu) setOpenMenu(false);
        else setOpenMenu(true);
      }}
    >
      <Typography variant="bodySmall">Connected</Typography>
      <Typography variant="bodySmall" fontWeight={500}>
        {user?.username ?? ""}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => {
          setOpenMenu(false);
        }}
        sx={{
          mt: 2,
        }}
      >
        <MenuItem
          onClick={() => {
            dispatch(resetUser());
            setOpenMenu(false);
          }}
        >
          <Typography variant="bodySmall">Logout</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

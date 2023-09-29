import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import React from "react";

export default function LightDarkButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="subtle"
      c={dark ? "yellow" : "white"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
    </ActionIcon>
  );
}

import { Box, Card, Grid } from "@mantine/core";
import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import PasswordConstraints from "./PasswordConstraints";

const Security = () => {
  const [password, setPassword] = useState("");
  const [validationsPassed, setValidationsPassed] = useState(false);

  return (
    <Box>
      <Grid grow>
        <Grid.Col span={6}>
          <ChangePassword
            onPasswordChange={setPassword}
            canSave={validationsPassed}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <PasswordConstraints
            password={password}
            onValidationChange={setValidationsPassed}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Security;

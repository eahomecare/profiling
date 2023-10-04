import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Center,
  Box,
  Flex,
  Stack,
  BackgroundImage,
  Card,
  Image,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, redirect, useNavigate } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";
import loginImage from "./assets/login.png";
import eaLogo from "./assets/eaLogo.png";
import { loginUser } from "../../redux/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRolesPermissionsMappings,
  getAllRolesPermissionsMappingsByUser,
} from "../../redux/rolesPermissionSlice";
import Recaptcha from "./Recaptcha";
import StyledPasswordInput from "../../StyledComponents/StyledPasswordInput";
import StyledTextInput from "../../StyledComponents/StyledTextInput";
import StyledButton from "../../StyledComponents/StyledButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, isLoggedIn, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // useEffect(() => {
  //     if(status === "success" && isLoggedIn){
  //         dispatch(getAllRolesPermissionsMappings())
  //     }
  // },[status,isLoggedIn])

  useEffect(() => {
    if (status === "success" && isLoggedIn) {
      dispatch(getAllRolesPermissionsMappingsByUser(user._id));
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <>
      <Box
        h={"100vh"}
        sx={{
          backgroundImage: "radial-gradient(#F2F2F2 50% ,#EBDFFF)",
        }}
      >
        <Grid pt={"8%"} grow>
          <Grid.Col span={6}>
            <Center>
              <Box>
                <BackgroundImage
                  style={{ width: "500px", height: "550px" }}
                  src={loginImage}
                  radius={"md"}
                >
                  <Stack p={"5%"} h={"100%"} justify={"end"}>
                    <Text c={"white"}>
                      <Flex justify={"end"}>
                        <Title
                          variant={"gradient"}
                          gradient={{ from: "#5C00F2", to: "#EBDFFF", deg: 45 }}
                        >
                          Customer Profiling
                        </Title>
                      </Flex>
                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. */}
                      {/* Morbi auctor sagittis nunc nec sollicitudin. Duis ultrices */}
                      {/* tristique ligula ac suscipit. */}
                    </Text>
                    {/* <StyledButton w={"30%"}> */}
                    {/*   Read More */}
                    {/*   <IconArrowRight /> */}
                    {/* </StyledButton> */}
                  </Stack>
                </BackgroundImage>
              </Box>
            </Center>
          </Grid.Col>
          <Grid.Col span={6}>
            <Box>
              <Center>
                <Stack w={"80%"} justify={"center"} align={"stretch"}>
                  <Box>
                    <Center>
                      <Image
                        width={150}
                        height={128}
                        src={eaLogo}
                        bg={"#F2F2F2"}
                      />
                    </Center>
                  </Box>
                  <Card shadow={"lg"} radius={"md"}>
                    <Stack>
                      <StyledTextInput
                        label="Email"
                        placeholder="you@ea.in"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <StyledPasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Group position="apart">
                        <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
                        {/* <Anchor>
                                                onClick={(event) => event.preventDefault()}
                                                href="#"
                                                size="sm"

                                                Forgot password?
                                            </Anchor> */}
                        <Text size={"sm"} c={"#5C00F2"}>
                          Forgot Password
                        </Text>
                      </Group>
                      <Recaptcha />

                      <StyledButton type="submit" onClick={handleSubmit}>
                        {status === "loading" ? <>Signing in</> : <>Sign in</>}
                      </StyledButton>

                      {status === "failed" && (
                        <Text style={{ color: "red" }}>
                          Incorrect credentials !
                        </Text>
                      )}
                    </Stack>
                  </Card>
                </Stack>
              </Center>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </>
    // <div style={{ backgroundColor: '#f1f3f5', minHeight: '1000px', marginTop: '-40px' }}>
    // </div>
  );
}

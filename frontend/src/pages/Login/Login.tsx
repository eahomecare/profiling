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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, redirect, useNavigate } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";
import loginImage from './assets/login.png'
import eaLogo from './assets/eaLogo.png'
import { loginUser } from "../../redux/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
// import { useNavigate } from 'react-router-dom';



export default function Login() {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const dispatch = useDispatch<AppDispatch>();
    //   const navigate = useNavigate();


  const { status, isLoggedIn } = useSelector((state: RootState)=> state.auth);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     dispatch(loginUser(loginData));
//   };


  const form = useForm({
      initialValues: { email: '' },

      // functions will be used to validate values at corresponding key
      validate: {
          email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      },
  });
  return (
      <>
          <Box>
              <Stack>
                  <Flex>
                      <Box>
                          <Paper>
                              <BackgroundImage
                                  style={{ width: '500px', height: '550px' }}
                                  src={loginImage}
                                  radius={'md'}
                                  pt={300}
                                  mt={95}
                                  ml={69}
                              >
                                  <Text
                                      c={'white'}
                                      pl={48}
                                      pr={56}
                                  >
                                      <Title>
                                          Title
                                      </Title>
                                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi auctor sagittis nunc nec sollicitudin. Duis ultrices tristique ligula ac suscipit.
                                  </Text>
                                  <Button
                                      ml={48}
                                      mb={48}
                                      mt={30}
                                  >
                                      Read More
                                      <IconArrowRight />

                                  </Button>
                              </BackgroundImage>
                          </Paper>
                      </Box>
                      <Box>
                          <Center>
                              <Stack>
                                  <Paper>
                                      <Image
                                          width={150}
                                          height={128}
                                          src={eaLogo}
                                          mt={95}
                                          mr={313}
                                          ml={288}
                                          mb={33}
                                      />
                                  </Paper>
                                  <Card
                                      shadow={'md'}
                                      ml={50}
                                      mr={100}
                                      bg={'#F1F5F9'}
                                  >

                                      <form >
                                          <TextInput label="Email" placeholder="you@ea.in" required {...form.getInputProps("email")} />
                                          <PasswordInput
                                              label="Password"
                                              placeholder="Your password"
                                              required
                                              mt="md"
                                          />
                                          <Group position="apart" mt="lg">
                                              <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
                                              <Anchor<"a">
                                                  onClick={(event) => event.preventDefault()}
                                                  href="#"
                                                  size="sm"
                                              >
                                                  Forgot password?
                                              </Anchor>
                                          </Group>
                                          <Button fullWidth mt="xl" type="submit">
                                              Sign in
                                          </Button>
                                      </form>
                                  </Card>
                              </Stack>
                          </Center>
                      </Box>
                  </Flex>
              </Stack>
          </Box>
      </>
      // <div style={{ backgroundColor: '#f1f3f5', minHeight: '1000px', marginTop: '-40px' }}>
      // </div>
  );
}

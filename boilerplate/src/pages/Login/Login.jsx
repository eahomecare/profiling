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

  
  
  
  export default function Login() {

      const [email,setEmail] = useState("")
      const [password,setPassword] = useState("")
      const dispatch = useDispatch();
      const navigate = useNavigate();
    
  
  
    const { status, isLoggedIn } = useSelector((state)=> state.auth);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(loginUser({email,password}));
    };
  
  

    useEffect(() => {
        if (isLoggedIn) {
          navigate("/")
        }
      }, [isLoggedIn, navigate]);

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
  
                                            <TextInput label="Email" placeholder="you@ea.in" value={email} required onChange={(e) => setEmail(e.target.value)} />
                                            <PasswordInput
                                                label="Password"
                                                placeholder="Your password"
                                                required
                                                mt="md"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Group position="apart" mt="lg">
                                                <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
                                                <Anchor>
                                                    onClick={(event) => event.preventDefault()}
                                                    href="#"
                                                    size="sm"
                                                
                                                    Forgot password?
                                                </Anchor>
                                            </Group>

                                            <Button fullWidth mt="xl" type="submit" onClick={handleSubmit}>
                                                {status === "loading"? <>Signing in</>:<>Sign in</>} 
                                            </Button>
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
  
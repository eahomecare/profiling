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
} from "@mantine/core";
import { Link } from "react-router-dom";

export default function Register() {
    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({
                    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                    fontWeight: 900,
                })}
            >
                Customer Profiling
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5} component={Link} to={'/'}>
                <Center>
                    Already have an account?
                    <Text c={'blue'}>
                        Login
                    </Text>
                </Center>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Email" placeholder="you@ea.in" required />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    mt="md"
                />
                <Group position="apart" mt="lg">
                    <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
                    {/* <Anchor<"a">
                        onClick={(event) => event.preventDefault()}
                        href="#"
                        size="sm"
                    >
                        Forgot password?
                    </Anchor> */}
                </Group>
                <Link to={'/dashboard'}>
                    <Button fullWidth mt="xl">
                        Register
                    </Button>
                </Link>
            </Paper>
        </Container>
    );
}

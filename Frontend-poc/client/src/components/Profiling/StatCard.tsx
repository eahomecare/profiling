import { createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, rem, Avatar } from '@mantine/core';
import { IconSwimming } from '@tabler/icons-react';

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        overflow: 'visible',
        padding: theme.spacing.xl,
        paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
    },

    icon: {
        position: 'absolute',
        top: `calc(-${ICON_SIZE} / 3)`,
        left: `calc(50% - ${ICON_SIZE} / 2)`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

const getExpertiseLevel = (percentageCompleted: number) => {
    if (percentageCompleted >= 0 && percentageCompleted <= 10) {
        return 'Clueless Newbie';
    } else if (percentageCompleted > 10 && percentageCompleted <= 25) {
        return 'Bumbling Beginner';
    } else if (percentageCompleted > 25 && percentageCompleted <= 40) {
        return 'Somewhat Savvy';
    } else if (percentageCompleted > 40 && percentageCompleted <= 60) {
        return 'Eager Explorer';
    } else if (percentageCompleted > 60 && percentageCompleted <= 75) {
        return 'Amusingly Advanced';
    } else if (percentageCompleted > 75 && percentageCompleted <= 90) {
        return 'Whimsical Wizard';
    } else {
        return 'Expert Extraordinaire';
    }
}

export function StatsCard({ title, url, percentage, frequency, lastUpdated }: any) {
    const { classes } = useStyles();

    return (
        <Paper radius="md" withBorder className={classes.card} mt={`calc(${ICON_SIZE} / 3)`}>
            <Avatar className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE} src={url} />
            <Text ta="center" fw={700} className={classes.title}>
                {title}
            </Text>
            <Text c="dimmed" ta="center" fz="sm">
                {getExpertiseLevel(percentage)}
            </Text>
            <Group position="apart" mt="xs">
                <Text fz="sm" color="dimmed">
                    Percentage Completed
                </Text>
                <Text fz="sm" color="dimmed">
                    {percentage}%
                </Text>
            </Group>
            <Progress value={percentage} mt={5} />
            <Group position="apart" mt="md">
                <Text fz="sm">{frequency} times a month</Text>
                <Badge size="sm">{lastUpdated} days ago</Badge>
            </Group>
        </Paper>
    );
}
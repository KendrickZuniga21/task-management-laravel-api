import {
    useEffect,
    useState
} from 'react';

import DashboardLayout
    from '../layouts/DashboardLayout';

import laravelApi
    from '../api/laravelApis';

import nodeApi
    from '../api/nodeApi';

import {
    useAuth
} from '../context/AuthContext';

import {
    Typography,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Box
} from '@mui/material';

import ExpandMoreIcon
    from '@mui/icons-material/ExpandMore';

export default function Analytics() {

    const { user } = useAuth();

    const [teams, setTeams] =
        useState([]);

    const [selectedTeam, setSelectedTeam] =
        useState('');

    const [summary, setSummary] =
        useState(null);

    const [productivity, setProductivity] =
        useState([]);

    const [deadlines, setDeadlines] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    const loadAnalytics =
        async (teamId) => {

            try {

                setLoading(true);

                const [
                    summaryResponse,
                    productivityResponse,
                    deadlinesResponse
                ] = await Promise.all([

                    nodeApi.get(
                        `/analytics/task-summary?team_id=${teamId}`
                    ),

                    nodeApi.get(
                        `/analytics/team-productivity?team_id=${teamId}`
                    ),

                    nodeApi.get(
                        `/analytics/upcoming-deadlines?team_id=${teamId}`
                    )

                ]);

                setSummary(
                    summaryResponse.data
                );

                setProductivity(
                    productivityResponse.data
                );

                setDeadlines(
                    deadlinesResponse.data
                );

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

    const loadTeams =
        async () => {

            try {

                const response =
                    await laravelApi.get(
                        '/teams/options'
                    );

                const teamList =
                    response.data;

                setTeams(
                    teamList
                );

                if (
                    teamList.length > 0
                ) {

                    const defaultTeamId =
                        teamList[0].id;

                    setSelectedTeam(
                        defaultTeamId
                    );

                    await loadAnalytics(
                        defaultTeamId
                    );
                }

            } catch (error) {

                console.error(error);

            }

        };

    useEffect(() => {

        loadTeams();

    }, []);

    const handleTeamChange =
        async (event) => {

            const teamId =
                event.target.value;

            setSelectedTeam(
                teamId
            );

            await loadAnalytics(
                teamId
            );

        };

    return (

        <DashboardLayout>

            <Typography
                variant="h4"
                gutterBottom
            >
                Analytics
            </Typography>

            {
                user?.role === 'admin' && (

                    <FormControl
                        fullWidth
                        sx={{
                            mb: 3
                        }}
                    >

                        <InputLabel>
                            Team
                        </InputLabel>

                        <Select
                            value={selectedTeam}
                            label="Team"
                            onChange={
                                handleTeamChange
                            }
                        >

                            {
                                teams.map(
                                    team => (

                                    <MenuItem
                                        key={team.id}
                                        value={team.id}
                                    >
                                        {team.name}
                                    </MenuItem>

                                ))
                            }

                        </Select>

                    </FormControl>

                )
            }

            {
                user?.role === 'manager' &&
                teams.length > 0 && (

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3
                        }}
                    >
                        Team:
                        {' '}
                        {teams[0].name}
                    </Typography>

                )
            }

            {
                loading && (

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6,
                            mb: 6
                        }}
                    >

                        <CircularProgress />

                    </Box>

                )
            }

            {
                !loading &&
                summary && (

                    <>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                mb: 4
                            }}
                        >

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >
                                <Paper
                                    sx={{
                                        p: 3
                                    }}
                                >
                                    <Typography>
                                        Total Tasks
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                    >
                                        {
                                            summary.total_tasks
                                        }
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >
                                <Paper
                                    sx={{
                                        p: 3
                                    }}
                                >
                                    <Typography>
                                        Pending
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                    >
                                        {
                                            summary.pending
                                        }
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >
                                <Paper
                                    sx={{
                                        p: 3
                                    }}
                                >
                                    <Typography>
                                        In Progress
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                    >
                                        {
                                            summary.in_progress
                                        }
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >
                                <Paper
                                    sx={{
                                        p: 3
                                    }}
                                >
                                    <Typography>
                                        Completed
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                    >
                                        {
                                            summary.completed
                                        }
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >
                                <Paper
                                    sx={{
                                        p: 3
                                    }}
                                >
                                    <Typography>
                                        High Priority
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                    >
                                        {
                                            summary.high_priority
                                        }
                                    </Typography>
                                </Paper>
                            </Grid>

                        </Grid>

                        <Typography
                            variant="h5"
                            gutterBottom
                        >
                            Team Productivity
                        </Typography>

                        <TableContainer
                            component={Paper}
                            sx={{
                                mb: 4
                            }}
                        >

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            Member
                                        </TableCell>

                                        <TableCell>
                                            Task Count
                                        </TableCell>

                                        <TableCell>
                                            Completed
                                        </TableCell>

                                        <TableCell>
                                            Completion Rate
                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {
                                        productivity.map(
                                            member => (

                                            <TableRow
                                                key={
                                                    member.user
                                                }
                                            >

                                                <TableCell>
                                                    {
                                                        member.user
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        member.task_count
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        member.completed_tasks
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        member.completion_rate
                                                    }%
                                                </TableCell>

                                            </TableRow>

                                        ))
                                    }

                                </TableBody>

                            </Table>

                        </TableContainer>

                        <Typography
                            variant="h5"
                            gutterBottom
                        >
                            Upcoming Deadlines
                        </Typography>

                        {
                            Object.entries(
                                deadlines
                            ).map(
                                ([member, tasks]) => (

                                <Accordion
                                    key={member}
                                >

                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon />
                                        }
                                    >

                                        <Typography>
                                            {member}
                                        </Typography>

                                    </AccordionSummary>

                                    <AccordionDetails>

                                        {
                                            tasks.map(
                                                task => (

                                                <Paper
                                                    key={
                                                        task.id
                                                    }
                                                    sx={{
                                                        p: 2,
                                                        mb: 1
                                                    }}
                                                >

                                                    <Typography>
                                                        <strong>
                                                            Title:
                                                        </strong>
                                                        {' '}
                                                        {
                                                            task.title
                                                        }
                                                    </Typography>

                                                    <Typography>
                                                        <strong>
                                                            Status:
                                                        </strong>
                                                        {' '}
                                                        {
                                                            task.status
                                                        }
                                                    </Typography>

                                                    <Typography>
                                                        <strong>
                                                            Due Date:
                                                        </strong>
                                                        {' '}
                                                        {
                                                            task.due_date
                                                        }
                                                    </Typography>

                                                </Paper>

                                            ))
                                        }

                                    </AccordionDetails>

                                </Accordion>

                            ))
                        }

                    </>
                )
            }

        </DashboardLayout>

    );
}
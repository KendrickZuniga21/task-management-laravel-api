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
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Box,
    Snackbar,
    Alert
} from '@mui/material';

export default function Export() {

    const { user } = useAuth();

    const [teams, setTeams] =
        useState([]);

    const [selectedTeam, setSelectedTeam] =
        useState('');

    const [format, setFormat] =
        useState('csv');

    const [loading, setLoading] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: '',
            severity: 'success'
        });

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

                    setSelectedTeam(
                        teamList[0].id
                    );
                }

            } catch (error) {

                console.error(error);

            }

        };

    useEffect(() => {

        if (!user) {
            return;
        }

        loadTeams();

    }, [user]);

    const handleExport =
        async () => {

            try {

                setLoading(true);

                const response =
                    await nodeApi.post(
                        '/export/tasks',
                        {
                            team_id:
                                selectedTeam,
                            format
                        },
                        {
                            responseType:
                                format === 'json'
                                    ? 'json'
                                    : 'blob'
                        }
                    );

                if (
                    format === 'json'
                ) {

                    const blob =
                        new Blob(
                            [
                                JSON.stringify(
                                    response.data,
                                    null,
                                    2
                                )
                            ],
                            {
                                type:
                                    'application/json'
                            }
                        );

                    const url =
                        window.URL.createObjectURL(
                            blob
                        );

                    const link =
                        document.createElement(
                            'a'
                        );

                    link.href = url;

                    link.download =
                        'tasks.json';

                    link.click();

                    window.URL.revokeObjectURL(
                        url
                    );

                } else {

                    const blob =
                        new Blob([
                            response.data
                        ]);

                    const url =
                        window.URL.createObjectURL(
                            blob
                        );

                    const link =
                        document.createElement(
                            'a'
                        );

                    link.href = url;

                    link.download =
                        format === 'csv'
                            ? 'tasks.csv'
                            : 'tasks.xlsx';

                    link.click();

                    window.URL.revokeObjectURL(
                        url
                    );
                }

                setSnackbar({
                    open: true,
                    message:
                        'Export generated successfully',
                    severity: 'success'
                });

            } catch (error) {

                console.error(error);

                setSnackbar({
                    open: true,
                    message:
                        'Export failed',
                    severity: 'error'
                });

            } finally {

                setLoading(false);

            }

        };

    return (

        <DashboardLayout>

            <Typography
                variant="h4"
                gutterBottom
            >
                Export Tasks
            </Typography>

            <Paper
                sx={{
                    p: 3,
                    maxWidth: 600
                }}
            >

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
                                value={
                                    selectedTeam
                                }
                                label="Team"
                                onChange={
                                    event =>
                                        setSelectedTeam(
                                            event.target.value
                                        )
                                }
                            >

                                {
                                    teams.map(
                                        team => (

                                        <MenuItem
                                            key={
                                                team.id
                                            }
                                            value={
                                                team.id
                                            }
                                        >
                                            {
                                                team.name
                                            }
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

                <FormControl
                    fullWidth
                    sx={{
                        mb: 3
                    }}
                >

                    <InputLabel>
                        Format
                    </InputLabel>

                    <Select
                        value={format}
                        label="Format"
                        onChange={
                            event =>
                                setFormat(
                                    event.target.value
                                )
                        }
                    >

                        <MenuItem value="json">
                            JSON
                        </MenuItem>

                        <MenuItem value="csv">
                            CSV
                        </MenuItem>

                        <MenuItem value="xlsx">
                            XLSX
                        </MenuItem>

                    </Select>

                </FormControl>

                <Button
                    variant="contained"
                    fullWidth
                    disabled={
                        loading ||
                        !selectedTeam
                    }
                    onClick={
                        handleExport
                    }
                >

                    {
                        loading
                            ? (
                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />
                            )
                            : (
                                'Export'
                            )
                    }

                </Button>

            </Paper>

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    3000
                }
                onClose={() =>
                    setSnackbar(
                        prev => ({
                            ...prev,
                            open: false
                        })
                    )
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                >
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </DashboardLayout>

    );
}
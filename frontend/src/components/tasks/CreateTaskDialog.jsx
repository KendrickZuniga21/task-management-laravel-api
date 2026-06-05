import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert
} from '@mui/material';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import laravelApi from '../../api/laravelApis';
import { useAuth } from '../../context/AuthContext';

export default function CreateTaskDialog({
    open,
    onClose,
    onCreated
}) {
    const { user } = useAuth();

    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
   

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            team_id:'',
            title: '',
            description: '',
            priority: '',
            assigned_to: '',
            due_date: ''
        }
    });
    const selectedTeamId = watch('team_id');

    const filteredUsers =
        user?.role === 'admin'
            ? users.filter(currentUser =>
                currentUser.team_ids?.includes(
                    Number(selectedTeamId)
                )
            )
            : users;

            

    const onSubmit = async (data) => {
        try {
             const teamId =
                user.role === 'admin'
                    ? data.team_id
                    : user?.team_ids?.[0];

            await laravelApi.post(
                `/teams/${teamId}/tasks`,
                {
                    title: data.title,
                    description: data.description,
                    priority: data.priority,
                    assigned_to: data.assigned_to,
                    due_date: data.due_date
                }
            );

            setSnackbar({
                open: true,
                message: 'Task created successfully',
                severity: 'success'
            });
            await onCreated?.();
            onClose();

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    'Failed to create task',
                severity: 'error'
            });

        }

    };

    useEffect(() => {

        if (!open) {
            return;
        }

        const loadOptions = async () => {

            try {

               const usersResponse =
                    await laravelApi.get(
                        '/users/assignees'
                    );

                setUsers(
                    usersResponse.data
                );

                if (user?.role === 'admin') {

                    const teamsResponse =
                        await laravelApi.get(
                            '/teams/options'
                        );

                    setTeams(
                        teamsResponse.data
                    );

                }

            } catch (error) {

                console.error(error);

            }

        };

        loadOptions();

    }, [open]);
    
    return (
        <>
        
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Create Task
            </DialogTitle>

            <DialogContent>

                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    {...register(
                        'title',
                        {
                            required:
                                'Title is required'
                        }
                    )}
                    error={!!errors.title}
                    helperText={
                        errors.title?.message
                    }
                />

                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    {...register(
                        'description',
                        {
                            required:
                                'Description is required'
                        }
                    )}
                    error={!!errors.description}
                    helperText={
                        errors.description?.message
                    }
                />

                {user?.role === 'admin' && (

                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Team
                        </InputLabel>

                        <Select
                            label="Team"
                            defaultValue=""
                            {...register(
                                'team_id',
                                {
                                    required:
                                        'Team is required'
                                }
                            )}
                        >
                            {teams.map(team => (

                                <MenuItem
                                    key={team.id}
                                    value={team.id}
                                >
                                    {team.name}
                                </MenuItem>

                            ))}
                        </Select>

                    </FormControl>

                )}

                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Priority
                    </InputLabel>

                    <Select
                        label="Priority"
                        defaultValue=""
                        {...register(
                            'priority',
                            {
                                required:
                                    'Priority is required'
                            }
                        )}
                    >
                        <MenuItem value="low">
                            Low
                        </MenuItem>

                        <MenuItem value="medium">
                            Medium
                        </MenuItem>

                        <MenuItem value="high">
                            High
                        </MenuItem>

                    </Select>

                </FormControl>

                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Assigned To
                    </InputLabel>

                    <Select
                        label="Assigned To"
                        defaultValue=""
                        disabled={
                            user?.role === 'admin' &&
                            !selectedTeamId
                        }
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 250
                                }
                            }
                        }}
                        {...register(
                            'assigned_to',
                            {
                                required:
                                    'Assignee is required'
                            }
                        )}
                    >
                        {filteredUsers.map(currentUser => (

                            <MenuItem
                                key={currentUser.id}
                                value={currentUser.id}
                            >
                                {currentUser.name}
                            </MenuItem>

                        ))}
                    </Select>

                </FormControl>

                <TextField
                    type="date"
                    fullWidth
                    margin="normal"
                    {...register(
                        'due_date',
                        {
                            required:
                                'Due date is required'
                        }
                    )}
                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit(
                            onSubmit
                        )
                    }
                >
                    Save
                </Button>

            </DialogActions>

        </Dialog>
        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() =>
                setSnackbar(prev => ({
                    ...prev,
                    open: false
                }))
            }
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
        >
            <Alert
                severity={snackbar.severity}
                variant="filled"
                onClose={() =>
                    setSnackbar(prev => ({
                        ...prev,
                        open: false
                    }))
                }
            >
                {snackbar.message}
            </Alert>
        </Snackbar>

        </>
    );
}
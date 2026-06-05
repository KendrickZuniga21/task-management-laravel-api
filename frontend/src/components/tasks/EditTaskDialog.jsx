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

import {
    useEffect,
    useState
} from 'react';

import {
    useForm
} from 'react-hook-form';

import laravelApi from '../../api/laravelApis';
import { Controller } from 'react-hook-form';

export default function EditTaskDialog({
    open,
    onClose,
    task,
    onUpdated
}) {

    const [users, setUsers] = useState([]);
    const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
});

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm();

    useEffect(() => {

        if (!task) {
            return;
        }

        reset({
            title: task.title,
            description: task.description,
            priority: task.priority,
            assigned_to: task.assigned_to,
            status: task.status,
            due_date: task.due_date?.split('T')[0]
        });

    }, [task, reset]);

    useEffect(() => {

        if (!open) {
            return;
        }

        const loadUsers = async () => {

            try {

                const response =
                    await laravelApi.get(
                        '/users/assignees'
                    );

                setUsers(
                    response.data
                );

            } catch (error) {

                console.error(error);

            }

        };

        loadUsers();

    }, [open]);

    const onSubmit = async (data) => {
        try {
            await laravelApi.patch(
                `/tasks/${task.id}`,
                data
            );
            await onUpdated?.();
            setSnackbar({
                open: true,
                message: 'Task updated successfully',
                severity: 'success'
            });
            onClose();
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    'Failed to update task',
                severity: 'error'
            });
        }
    };

    return (
        <>
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                Edit Task
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
                    error={
                        !!errors.description
                    }
                    helperText={
                        errors.description?.message
                    }
                />

                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Priority
                    </InputLabel>

                    <Controller
                        name="priority"
                        control={control}
                        rules={{
                            required: 'Priority is required'
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Priority"
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
                        )}
                    />

                </FormControl>

                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Assigned To
                    </InputLabel>

                    <Controller
                        name="assigned_to"
                        control={control}
                        rules={{
                            required: 'Assignee is required'
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Assigned To"
                            >
                                {users.map(user => (

                                    <MenuItem
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name}
                                    </MenuItem>

                                ))}
                            </Select>
                        )}
                    />

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
                
                {/* <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Status
                    </InputLabel>

                    <Controller
                        name="status"
                        control={control}
                        rules={{
                            required: 'Status is required'
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Status"
                            >
                                <MenuItem value="pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="in_progress">
                                    In Progress
                                </MenuItem>

                                <MenuItem value="completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="cancelled">
                                    Cancelled
                                </MenuItem>

                            </Select>
                        )}
                    />

                </FormControl> */}

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
                    Update
                </Button>

            </DialogActions>

        </Dialog>
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
            <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    </>
    );
}
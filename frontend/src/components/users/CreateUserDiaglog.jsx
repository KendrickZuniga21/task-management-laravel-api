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
    Controller,
    useForm
} from 'react-hook-form';

import {
    useState
} from 'react';

import laravelApi from '../../api/laravelApis';

import {
    useAuth
} from '../../context/AuthContext';

export default function CreateUserDialog({
    open,
    onClose,
    onCreated
}) {

    const { user } = useAuth();

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: '',
            severity: 'success'
        });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: ''
        }
    });

    const handleClose = () => {

        reset();

        onClose();

    };

    const onSubmit = async (data) => {

        try {

            await laravelApi.post(
                '/users',
                data
            );

            setSnackbar({
                open: true,
                message:
                    'User created successfully',
                severity: 'success'
            });

            await onCreated?.();

            reset();

            onClose();

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    'Failed to create user',
                severity: 'error'
            });

        }

    };

    return (
        <>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Create User
                </DialogTitle>

                <DialogContent>

                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        {...register(
                            'name',
                            {
                                required:
                                    'Name is required'
                            }
                        )}
                        error={!!errors.name}
                        helperText={
                            errors.name?.message
                        }
                    />

                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        {...register(
                            'email',
                            {
                                required:
                                    'Email is required'
                            }
                        )}
                        error={!!errors.email}
                        helperText={
                            errors.email?.message
                        }
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register(
                            'password',
                            {
                                required:
                                    'Password is required',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password must be at least 8 characters'
                                }
                            }
                        )}
                        error={!!errors.password}
                        helperText={
                            errors.password?.message
                        }
                    />

                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.role}
                    >

                        <InputLabel>
                            Role
                        </InputLabel>

                        <Controller
                            name="role"
                            control={control}
                            rules={{
                                required:
                                    'Role is required'
                            }}
                            render={({ field }) => (

                                <Select
                                    {...field}
                                    label="Role"
                                >

                                    {user?.role === 'admin' && (
                                        <>
                                            <MenuItem value="admin">
                                                Admin
                                            </MenuItem>

                                            <MenuItem value="manager">
                                                Manager
                                            </MenuItem>
                                        </>
                                    )}

                                    <MenuItem value="member">
                                        Member
                                    </MenuItem>

                                </Select>

                            )}
                        />

                    </FormControl>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={handleClose}
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
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar(prev => ({
                        ...prev,
                        open: false
                    }))
                }
            >
                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </>
    );
}
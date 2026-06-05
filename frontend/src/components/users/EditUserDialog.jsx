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
    useState,
    useEffect
} from 'react';

import laravelApi from '../../api/laravelApis';
import {
    useAuth
} from '../../context/AuthContext';

export default function EditUserDialog({
    open,
    onClose,
    user,
    onUpdated,
    userRole
}) {

    const { user: currentUser } = useAuth();
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
            role: ''
        }
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        if (!user) {
            return;
        }

        reset({
            name: user.name,
            email: user.email,
            role: user.role
        });
    }, [user, reset]);

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false
        }));
    };

    const onSubmit = async (data) => {
        try {
            await laravelApi.patch(
                `/users/${user.id}`,
                data
            );

            await onUpdated?.();

            setSnackbar({
                open: true,
                message: 'User updated successfully.',
                severity: 'success'
            });

            setTimeout(() => {
                handleClose();
            }, 1000);

        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    'Failed to update user.',
                severity: 'error'
            });
        }
    };

    const handleClose = () => {
        reset();

        onClose();
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
                    Edit User
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
                                    {userRole?.role === 'admin' && (
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
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
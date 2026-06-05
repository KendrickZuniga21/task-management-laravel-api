import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';

import { useState } from 'react';

import { useForm } from 'react-hook-form';

import laravelApi from '../../api/laravelApis';

export default function CreateTeamDialog({
    open,
    onClose,
    onCreated
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: '',
            severity: 'success'
        });

    const onSubmit = async (data) => {

        try {

            await laravelApi.post(
                '/teams',
                data
            );

            await onCreated?.();

            setSnackbar({
                open: true,
                message:
                    'Team created successfully',
                severity: 'success'
            });

            reset();

            onClose();

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    'Failed to create team',
                severity: 'error'
            });

        }
    };

    return(
        <>
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Create Team
            </DialogTitle>

            <DialogContent>

                <TextField
                    label="Team Name"
                    fullWidth
                    margin="normal"
                    {...register(
                        'name',
                        {
                            required:
                                'Team name is required'
                        }
                    )}
                    error={!!errors.name}
                    helperText={
                        errors.name?.message
                    }
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
        >
            <Alert
                severity={snackbar.severity}
                variant="filled"
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
        </>
    )


}
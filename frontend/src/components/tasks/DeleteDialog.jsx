import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';

import { useState } from 'react';
import laravelApi from '../../api/laravelApis';

export default function DeleteTaskDialog({
    open,
    onClose,
    task,
    onDeleted
}) {

    const [loading, setLoading] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: '',
            severity: 'success'
        });

    const handleDelete = async () => {

        try {

            setLoading(true);

            await laravelApi.delete(
                `/tasks/${task.id}`
            );

            await onDeleted?.();

            setSnackbar({
                open: true,
                message:
                    'Task deleted successfully',
                severity: 'success'
            });

            onClose();

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    'Failed to delete task',
                severity: 'error'
            });

        } finally {

            setLoading(false);

        }

    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
            >

                <DialogTitle>
                    Delete Task
                </DialogTitle>

                <DialogContent>

                    <Typography>
                        Are you sure you want to
                        delete:
                    </Typography>

                    <Typography
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                    >
                        {task?.title}
                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
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
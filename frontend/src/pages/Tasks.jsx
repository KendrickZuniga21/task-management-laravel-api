import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import laravelApi from '../api/laravelApis';
import Typography from '@mui/material/Typography';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

import Button from '@mui/material/Button';

import CreateTaskDialog from '../components/tasks/CreateTaskDialog';
import EditTaskDialog from '../components/tasks/EditTaskDialog';
import DeleteTaskDialog from '../components/tasks/DeleteDialog';

import {
    useAuth
} from '../context/AuthContext';

export default function Tasks() {

    const [tasks, setTasks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [openCreateDialog, setOpenCreateDialog] =
        useState(false);

    const [editOpen, setEditOpen] =
        useState(false);

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const { user } = useAuth();

    const loadTasks = async () => {

        try {

            const response =
                await laravelApi.get(
                    '/tasks?all=true'
                );

            setTasks(
                response.data
            );

        } catch (error) {

            console.error(
                error
            );

        } finally {

            setLoading(false);

        }
    };

    const handleEditTask = (
        task
    ) => {

        setSelectedTask(
            task
        );

        setEditOpen(
            true
        );
    };

    const handleStatusChange = async (
        task,
        newStatus
    ) => {

        try {

            await laravelApi.patch(
                `/tasks/${task.id}/status`,
                {
                    status:
                        newStatus
                }
            );

            await loadTasks();

        } catch (error) {

            console.error(
                error
            );
        }
    };

    useEffect(() => {

        loadTasks();

    }, []);

    if (loading) {

        return (

            <DashboardLayout>

                <Typography
                    variant="h4"
                    className="font-bold mb-6"
                >
                    Loading Tasks...
                </Typography>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="flex justify-between items-center mb-6">

                <Typography
                    variant="h4"
                    className="font-bold"
                >
                    Tasks
                </Typography>

                {user?.role !== 'member' && (

                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpenCreateDialog(
                                true
                            )
                        }
                    >
                        Create Task
                    </Button>

                )}

            </div>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    className="font-bold"
                                >
                                    Title
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    className="font-bold"
                                >
                                    Status
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    className="font-bold"
                                >
                                    Priority
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    className="font-bold"
                                >
                                    Assigned To
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    className="font-bold"
                                >
                                    Due Date
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    className="font-bold"
                                >
                                    Actions
                                </Typography>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {tasks.map(task => (

                            <TableRow
                                key={task.id}
                            >

                                <TableCell>
                                    {task.title}
                                </TableCell>

                                <TableCell>
                                    {task.status}
                                </TableCell>

                                <TableCell>
                                    {task.priority}
                                </TableCell>

                                <TableCell>
                                    {
                                        task.assigned_user?.name
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        task.due_date
                                            ? new Date(
                                                task.due_date
                                            ).toLocaleDateString()
                                            : '-'
                                    }
                                </TableCell>

                                <TableCell>

                                    <div className="flex gap-2 flex-wrap">

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                handleEditTask(
                                                    task
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>

                                        {task.status === 'pending' && (

                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            task,
                                                            'in_progress'
                                                        )
                                                    }
                                                >
                                                    Start
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    color="warning"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            task,
                                                            'cancelled'
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </>

                                        )}

                                        {task.status === 'in_progress' && (

                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            task,
                                                            'completed'
                                                        )
                                                    }
                                                >
                                                    Complete
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            task,
                                                            'pending'
                                                        )
                                                    }
                                                >
                                                    Revert
                                                </Button>
                                            </>

                                        )}

                                        {(
                                            user?.role === 'admin' ||
                                            task.created_by === user?.id
                                        ) && (
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => {

                                                    setSelectedTask(
                                                        task
                                                    );

                                                    setDeleteOpen(
                                                        true
                                                    );

                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}

                                    </div>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

            <CreateTaskDialog
                open={
                    openCreateDialog
                }
                onCreated={
                    loadTasks
                }
                onClose={() =>
                    setOpenCreateDialog(
                        false
                    )
                }
            />

            <EditTaskDialog
                open={editOpen}
                onClose={() => {

                    setEditOpen(
                        false
                    );

                    setSelectedTask(
                        null
                    );

                }}
                task={
                    selectedTask
                }
                onUpdated={
                    loadTasks
                }
            />

            <DeleteTaskDialog
                open={deleteOpen}
                onClose={() => {

                    setDeleteOpen(
                        false
                    );

                    setSelectedTask(
                        null
                    );

                }}
                task={
                    selectedTask
                }
                onDeleted={
                    loadTasks
                }
            />

        </DashboardLayout>

    );
}
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

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const response = await laravelApi.get(
                    '/tasks?all=true'
                );

                setTasks(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();

    }, []);
    if(loading) {
        return (
             <DashboardLayout>
                <Typography variant="h4"  className="font-bold mb-6">
                    Loading Tasks...
                </Typography>
            </DashboardLayout>
        );
    } else {
        return (
            <DashboardLayout>
                <Typography variant="h4"  className="font-bold mb-6">
                    Tasks
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Title
                                </TableCell>
                                <TableCell>
                                    Status
                                </TableCell>
                                <TableCell>
                                    Priority
                                </TableCell>
                                <TableCell>
                                    Assigned To
                                </TableCell>
                                <TableCell>
                                    Due Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
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
                                        {task.assigned_user?.name}
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DashboardLayout>
        );
    }
}
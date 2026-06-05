import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import laravelApi from '../api/laravelApis';

import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Button
} from '@mui/material';
import CreateUserDialog from '../components/users/CreateUserDiaglog';
import EditUserDialog from '../components/users/EditUserDialog';
import { useAuth } from '../context/AuthContext';


export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setOpenEditUserDialog(true);
    };

  const { user: loggedInUser } = useAuth();

    const loadUsers = async () => {
        try {

            const response =
                await laravelApi.get(
                    '/users'
                );

            setUsers(
                response.data.data
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleToggleStatus = async () => {
        try {
            await laravelApi.patch(
                `/users/${selectedUser.id}/status`
            );
            await loadUsers();
            setOpenStatusDialog(false);
        } catch (error) {
            console.error(error);
        }

    };

    useEffect(() => {
        loadUsers();
    }, []);
    
    if (loading) {
        return (
            <DashboardLayout>
                <Typography variant="h4"  className="font-bold mb-6">
                    Loading Users...
                </Typography>
            </DashboardLayout>
        );

    } else {
        return (
            <DashboardLayout>
            <>
               <div className="flex justify-between items-center mb-6">
                    <Typography
                        variant="h4"
                        className="font-bold"
                    >
                        Users
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpenCreateDialog(true)
                        }
                    >
                        Create User
                    </Button>

                </div>

                <TableContainer
                    component={Paper}
                >

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    Name
                                </TableCell>

                                <TableCell>
                                    Email
                                </TableCell>

                                <TableCell>
                                    Role
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {users.map(user => (

                                <TableRow
                                    key={user.id}
                                >

                                    <TableCell>
                                        {user.name}
                                    </TableCell>

                                    <TableCell>
                                        {user.email}
                                    </TableCell>

                                    <TableCell>
                                        {user.role}
                                    </TableCell>
                                      <TableCell>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </TableCell>

                                    <TableCell>
                                       <div className="flex gap-2">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color={
                                                    user.is_active
                                                        ? 'warning'
                                                        : 'success'
                                                }
                                                onClick={() =>
                                                    handleToggleStatus(user)
                                                }
                                            >
                                                {
                                                    user.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'
                                                }
                                            </Button>
                                        </div>
                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>
                <CreateUserDialog
                    open={openCreateDialog}
                    onClose={() =>
                        setOpenCreateDialog(false)
                    }
                    onCreated={loadUsers}
                />
                <EditUserDialog
                    open={openEditUserDialog}
                    onClose={() =>
                        setOpenEditUserDialog(false)
                    }
                    user={selectedUser}
                    userRole={loggedInUser}
                    onUpdated={loadUsers}
                />
            </>
                
            </DashboardLayout>

        );
    }
   
}
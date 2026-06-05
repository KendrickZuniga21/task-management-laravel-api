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
import CreateTeamDialog from '../components/teams/CreateTeamDialog';
import TeamDetailsDialog from '../components/teams/TeamDetailsDialog';

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setOpenViewDialog(true);
    };

    const loadTeams = async () => {
        try {
            const response =
                await laravelApi.get(
                    '/teams'
                );
            setTeams(
                response.data.data
            );
        } catch (error) {

            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
    }, []);
    
    if (loading) {
        return (
            <DashboardLayout>
                <Typography variant="h4"  className="font-bold mb-6">
                    Loading Teams...
                </Typography>
            </DashboardLayout>
        );

    } else {
        return (
            <DashboardLayout>

               <div className="flex justify-between items-center mb-6">
                    <Typography
                        variant="h4"
                        className="font-bold"
                    >
                        Teams
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpenCreateDialog(true)
                        }
                    >
                        Create Team
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
                                    Members
                                </TableCell>

                                <TableCell>
                                    Created By
                                </TableCell>

                                <TableCell>
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {teams.map(team => (

                                <TableRow
                                    key={team.id}
                                >

                                    <TableCell>
                                        {team.name}
                                    </TableCell>

                                    <TableCell>
                                        {team.members_count}
                                    </TableCell>

                                    <TableCell>
                                        {team.creator?.name}
                                    </TableCell>

                                    <TableCell>

                                        <Button
                                            variant="contained"
                                            size="small"
                                             onClick={() =>
                                                handleViewTeam(team)
                                            }
                                        >
                                            View
                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>
                <CreateTeamDialog
                    open={openCreateDialog}
                    onClose={() =>
                        setOpenCreateDialog(false)
                    }
                    onCreated={loadTeams}
                />
                <TeamDetailsDialog
                    open={openViewDialog}
                    onUpdated={loadTeams}
                    onClose={() =>
                        setOpenViewDialog(false)
                    }
                    team={selectedTeam}
                />
            </DashboardLayout>

        );
    }
   
}
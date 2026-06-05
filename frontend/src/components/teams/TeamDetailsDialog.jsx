import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    useEffect,
    useState
} from 'react';
import laravelApi from '../../api/laravelApis';
import { useForm, Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';

export default function TeamDetailsDialog({
    open,
    onClose,
    team,
    onUpdated
}) 
{
        const {
        control,
        handleSubmit,
        reset
    } = useForm({
        defaultValues: {
            user_id: '',
            role: 'member'
        }
    });

    const [teamDetails, setTeamDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);

    const loadAvailableUsers = async () => {
        try {
            const response =
                await laravelApi.get(
                    `/teams/${team.id}/available-users`
                );
            setAvailableUsers(
                response.data
            );
        } catch (error) {
            console.error(error);
        }

    };

    const loadTeam = async () => {
            try {
                setLoading(true);
                const response =
                    await laravelApi.get(
                        `/teams/${team.id}`
                    );
                setTeamDetails(
                    response.data
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
    };

    const onAddMember = async (data) => {
        try {
            await laravelApi.post(
                `/teams/${team.id}/members`,
                data
            );
            await loadTeam();
            await loadAvailableUsers();
            await onUpdated?.();
            reset({
                user_id: '',
                role: 'member'
            });
        } catch (error) {

            console.error(error);

        }

    };

    const onRemoveMember = (member) => {
        setMemberToRemove(member);
        setOpenRemoveDialog(true);

    };

    const confirmRemoveMember = async () => {
        try {
            await laravelApi.delete(
                `/teams/${team.id}/members/${memberToRemove}`
            );
            setOpenRemoveDialog(false);
            await loadTeam();
            await loadAvailableUsers();
            await onUpdated?.();
            setMemberToRemove(null);


        } catch (error) {

            console.error(error);

        }

    };
    useEffect(() => {
        if (!open || !team) {
            return;
        }
        loadAvailableUsers();
        loadTeam();

    }, [open, team]);

    if (loading) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogContent>
                Loading...
            </DialogContent>
        </Dialog>
    );
    } else {
    return (
        <>
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                Team Details
            </DialogTitle>

            <DialogContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    {teamDetails?.name}
                </Typography>

                <Typography
                    sx={{ mb: 3 }}
                >
                    Created By:
                    {' '}
                    {teamDetails?.creator?.name}
                </Typography>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Members
                </Typography>

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
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {teamDetails?.members?.map(
                                member => (

                                    <TableRow
                                        key={member.id}
                                    >

                                        <TableCell>
                                            {member.name}
                                        </TableCell>

                                        <TableCell>
                                            {member.email}
                                        </TableCell>

                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => onRemoveMember(member.id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>

                                    </TableRow>

                                )
                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </DialogContent>

           

        <Accordion sx={{ mt: 2 }}>
        <AccordionSummary
            expandIcon={
                <ExpandMoreIcon />
            }
        >
            Add Member
        </AccordionSummary>
        {loading ? (
            <AccordionDetails>
                Loading...
            </AccordionDetails>
        ) : (
        <AccordionDetails>
           <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 8 }}>

                <FormControl fullWidth>
                    <InputLabel>
                        User
                    </InputLabel>

                    <Controller
                        name="user_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="User"
                            >
                                {availableUsers.map(user => (

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
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>
                        Role
                    </InputLabel>

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Role"
                            >
                                <MenuItem value="lead">
                                    Lead
                                </MenuItem>
                                <MenuItem value="member">
                                    Member
                                </MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>
            </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                    <Button
                        variant="contained"
                        onClick={
                            handleSubmit(
                                onAddMember
                            )
                        }
                    >
                        Add Member
                    </Button>
              </Grid>
        </Grid>

        </AccordionDetails>
    )}
    </Accordion>
     <DialogActions>
        <Button
            variant="outlined"
            onClick={onClose}
        >
            Close
        </Button>
        </DialogActions>
        </Dialog>

        <Dialog
        open={openRemoveDialog}
        onClose={() =>
            setOpenRemoveDialog(false)
        }
    >

        <DialogTitle>
            Remove Member
        </DialogTitle>

        <DialogContent>

            <Typography>
                Remove
                {' '}
                <strong>
                    {memberToRemove?.name}
                </strong>
                {' '}
                from this team?
            </Typography>

        </DialogContent>

        <DialogActions>

            <Button
                onClick={() =>
                    setOpenRemoveDialog(false)
                }
            >
                Cancel
            </Button>

            <Button
                color="error"
                variant="contained"
                onClick={confirmRemoveMember}
            >
                Remove
            </Button>

        </DialogActions>

    </Dialog>
        </>
    )
    }
}
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Button,
    Box
} from '@mui/material';

import {
    useNavigate
} from 'react-router-dom';

import {
    useAuth
} from '../context/AuthContext';

const drawerWidth = 240;

export default function DashboardLayout({
    children
}) {

    const navigate =
        useNavigate();

    const {
        user,
        logout
    } = useAuth();

    const handleLogout = () => {

        logout();

        navigate('/');
    };

    return (

        <Box
            sx={{
                display: 'flex'
            }}
        >

            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201
                }}
            >
                <Toolbar>

                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1
                        }}
                    >
                        Task Management System
                    </Typography>

                    <Typography
                        sx={{
                            mr: 2
                        }}
                    >
                        {user?.name}
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={
                            handleLogout
                        }
                    >
                        Logout
                    </Button>

                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    }
                }}
            >

                <Toolbar />

                <List>

                    <ListItemButton
                        onClick={() =>
                            navigate('/dashboard')
                        }
                    >
                        <ListItemText
                            primary="Dashboard"
                        />
                    </ListItemButton>

                    <ListItemButton
                    onClick={() =>
                            navigate('/tasks')
                        }>
                        
                        <ListItemText
                            primary="Tasks"
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() =>
                            navigate('/teams')
                        }
                    >
                        <ListItemText
                            primary="Teams"
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() =>
                            navigate('/users')
                        }
                    >
                        <ListItemText
                            primary="Users"
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() =>
                            navigate('/analytics')
                        }
                    >
                        <ListItemText
                            primary="Analytics"
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() =>
                            navigate('/export')
                        }
                    >
                        <ListItemText
                            primary="Export"
                        />
                    </ListItemButton>

                </List>

            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3
                }}
            >

                <Toolbar />

                {children}

            </Box>

        </Box>
    );
}
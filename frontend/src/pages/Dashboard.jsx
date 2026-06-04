import DashboardLayout from '../layouts/DashboardLayout';
import Typography from '@mui/material/Typography';  

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Typography variant="h4"  className="font-bold mb-6">
                Dashboard
            </Typography>
        </DashboardLayout>
    );
}
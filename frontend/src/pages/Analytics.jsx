import DashboardLayout
    from '../layouts/DashboardLayout';
import Typography from '@mui/material/Typography'; 

export default function Analytics() {
    return (
        <DashboardLayout>
            <Typography variant="h4"  className="font-bold mb-6">
                Analytics
            </Typography>
        </DashboardLayout>
    );
}
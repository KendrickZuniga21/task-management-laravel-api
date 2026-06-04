import {
    TextField,
    Button,
    Paper,
    Typography,
    Alert
} from '@mui/material';

import {
    useForm
} from 'react-hook-form';

import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    useAuth
} from '../context/AuthContext';

import laravelApi
    from '../api/laravelApis';

export default function Login() {

    const {
        register,
        handleSubmit
    } = useForm();

    const navigate =
        useNavigate();

    const {
        login
    } = useAuth();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    const onSubmit =
        async (data) => {

            try {

                setLoading(true);
                setError('');

                const response =
                    await laravelApi.post(
                        '/login',
                        data
                    );

                login(
                    response.data.token,
                    response.data.user
                );

                navigate(
                    '/dashboard'
                );

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    'Login failed'
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <div className="min-h-screen flex items-center justify-center">

            <Paper
                elevation={3}
                className="p-8 w-full max-w-md"
            >

                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                >
                    Login
                </Typography>

                {
                    error &&
                    (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )
                }

                <form
                    onSubmit={
                        handleSubmit(
                            onSubmit
                        )
                    }
                >

                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        {...register(
                            'email',
                            {
                                required: true
                            }
                        )}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register(
                            'password',
                            {
                                required: true
                            }
                        )}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {
                            loading
                                ? 'Logging in...'
                                : 'Login'
                        }
                    </Button>

                </form>

            </Paper>

        </div>
    );
}
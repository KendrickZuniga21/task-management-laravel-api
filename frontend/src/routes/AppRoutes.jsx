import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Teams from '../pages/Teams';
import Users from '../pages/Users';
import Analytics from '../pages/Analytics';
import Export from '../pages/Export';

import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams"
                    element={
                        <ProtectedRoute
                              roles={[
                                'admin',
                                'manager'
                            ]}
                        >
                            <Teams />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute
                              roles={[
                                'admin',
                                'manager'
                            ]}
                        >
                            <Users />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute
                              roles={[
                                'admin',
                                'manager'
                            ]}
                        >
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/export"
                    element={
                        <ProtectedRoute
                            roles={[
                                'admin',
                                'manager'
                            ]}
                        >
                            <Export />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}
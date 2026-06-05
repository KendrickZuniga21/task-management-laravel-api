<?php

namespace App\Http\Controllers\Api;

use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {

            $query = User::query();

            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            if ($request->filled('status')) {
                $query->where('is_active', $request->status);
            }

            $users = $query
                ->orderBy('id', 'asc')
                ->paginate(20);

            return response()->json($users);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json($user);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to retrieve user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8',
                'role' => 'required|in:admin,manager,member',
            ]);

            $authUser = auth()->user();

            if (
                $authUser->role === 'manager' &&
                $validated['role'] !== 'member'
            ) {
                return response()->json([
                    'message' => 'Managers can only create Team Members'
                ], 403);
            }

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'is_active' => true,
            ]);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
            ], 201);

        } catch (ValidationException $e) {

            throw $e;

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'role' => 'required|in:admin,manager,member',
            ]);

            $authUser = auth()->user();

           
            if (
                $authUser->role === 'manager' &&
                $validated['role'] !== 'member'
            ) {
                return response()->json([
                    'message' => 'Managers can only assign Team Member role'
                ], 403);
            }

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ]);

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user,
            ]);

        } catch (ValidationException $e) {

            throw $e;

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        try {

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $user->is_active = !$user->is_active;
            $user->save();

            return response()->json([
                'message' => 'User status updated successfully',
                'user' => $user,
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function assignees()
    {
        try {

            $user = auth()->user();

            if ($user->role === 'admin') {

                $users = User::where(
                    'is_active',
                    true
                )
                ->select(
                    'id',
                    'name',
                    'email',
                    'role'
                )
                ->get()
                ->map(function ($user) {
                    $user->team_ids = \App\Models\TeamMember::where(
                        'user_id',
                        $user->id
                    )
                    ->pluck('team_id');

                    return $user;
                });

                return response()->json(
                    $users
                );
            }

            if ($user->role === 'manager') {

                $users = User::query()
                    ->join(
                        'team_members',
                        'users.id',
                        '=',
                        'team_members.user_id'
                    )
                    ->whereIn(
                        'team_members.team_id',
                        function ($query) use ($user) {

                            $query->select(
                                'team_id'
                            )
                            ->from(
                                'team_members'
                            )
                            ->where(
                                'user_id',
                                $user->id
                            )
                            ->where(
                                'role',
                                'lead'
                            );
                        }
                    )
                    ->where(
                        'users.role',
                        'member'
                    )
                    ->where(
                        'users.is_active',
                        true
                    )
                    ->select(
                        'users.id',
                        'users.name',
                        'users.email'
                    )
                    ->distinct()
                    ->get();

                return response()->json(
                    $users
                );
            }

            return response()->json(
                []
            );

        } catch (\Exception $e) {

            return response()->json([
                'message' =>
                    'Failed to retrieve assignees',
                'error' =>
                    $e->getMessage()
            ], 500);
        }
    }
}

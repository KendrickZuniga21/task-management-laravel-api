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
                ->orderBy('id', 'desc')
                ->paginate(10);

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
}

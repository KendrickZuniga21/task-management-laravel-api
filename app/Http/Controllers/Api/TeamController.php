<?php

namespace App\Http\Controllers\Api;

use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\User;
use App\Models\TeamMember;

class TeamController extends Controller
{

    public function index()
    {
        try {

            $teams = Team::with('creator')
                ->withCount('members')
                ->paginate(10);

            return response()->json($teams);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to retrieve teams',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

        public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:teams,name',
            ]);

            $team = Team::create([
                'name' => $validated['name'],
                'created_by' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'Team created successfully',
                'team' => $team,
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

    public function show($id)
    {
        try {

            $team = Team::with([
                'creator',
                'members'
            ])->find($id);

            if (!$team) {
                return response()->json([
                    'message' => 'Team not found'
                ], 404);
            }

            return response()->json($team);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to retrieve team',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function addMember(Request $request, $id)
    {
        try {

            $team = Team::find($id);

            if (!$team) {
                return response()->json([
                    'message' => 'Team not found'
                ], 404);
            }

            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'role' => 'required|in:lead,member',
            ]);

            $authUser = auth()->user();

            
            $isAdmin = $authUser->role === 'admin';

            $isLead = $team->members()
                ->where('users.id', $authUser->id)
                ->wherePivot('role', 'lead')
                ->exists();

            if (!$isAdmin && !$isLead) {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            $alreadyMember = $team->members()
                ->where('users.id', $validated['user_id'])
                ->exists();

            if ($alreadyMember) {
                return response()->json([
                    'message' => 'User already belongs to this team'
                ], 422);
            }

            $team->members()->attach(
                $validated['user_id'],
                ['role' => $validated['role']]
            );

            return response()->json([
                'message' => 'Member added successfully'
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

    public function removeMember($id, $userId)
    {
        try {

            $team = Team::find($id);

            if (!$team) {
                return response()->json([
                    'message' => 'Team not found'
                ], 404);
            }

            $authUser = auth()->user();

            $isAdmin = $authUser->role === 'admin';

            $isLead = $team->members()
                ->where('users.id', $authUser->id)
                ->wherePivot('role', 'lead')
                ->exists();

            if (!$isAdmin && !$isLead) {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            $memberExists = $team->members()
                ->where('users.id', $userId)
                ->exists();

            if (!$memberExists) {
                return response()->json([
                    'message' => 'User is not a member of this team'
                ], 404);
            }

            $team->members()->detach($userId);

            return response()->json([
                'message' => 'Member removed successfully'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function options()
    {
        try {

            $user = auth()->user();

            if ($user->role === 'admin') {

                $teams = Team::select(
                    'id',
                    'name'
                )->get();

                return response()->json(
                    $teams
                );
            }

            if ($user->role === 'manager') {

                $teamIds = TeamMember::where(
                    'user_id',
                    $user->id
                )
                ->where(
                    'role',
                    'lead'
                )
                ->pluck(
                    'team_id'
                );

                $teams = Team::whereIn(
                    'id',
                    $teamIds
                )
                ->select(
                    'id',
                    'name'
                )
                ->get();

                return response()->json(
                    $teams
                );
            }

            return response()->json([]);

        } catch (\Exception $e) {

            return response()->json([
                'message' =>
                    'Failed to retrieve teams',
                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }

     public function availableUsers($id)
    {
        try {

            $team = Team::find($id);

            if (!$team) {
                return response()->json([
                    'message' => 'Team not found'
                ], 404);
            }

            $memberIds = $team->members()
                ->pluck('users.id');

            $users = User::where(
                'is_active',
                true
            )
            ->whereNotIn(
                'id',
                $memberIds
            )
            ->select(
                'id',
                'name',
                'email'
            )
            ->orderBy('name')
            ->get();

            return response()->json(
                $users
            );

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

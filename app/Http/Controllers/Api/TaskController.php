<?php

namespace App\Http\Controllers\Api;

use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\User;
use App\Models\Task;

class TaskController extends Controller
{
    public function index(Request $request, $team_id)
    {
        try {

            $team = Team::find($team_id);

            if (!$team) {
                return response()->json([
                    'message' => 'Team not found'
                ], 404);
            }

            $user = auth()->user();

            $query = Task::with([
                'assignedUser',
                'creator',
                'team'
            ])->where('team_id', $team_id);

            // Team members only see their own tasks
            if ($user->role === 'member') {
                $query->where('assigned_to', $user->id);
            }

            // Filters
            if ($request->status) {
                $query->where('status', $request->status);
            }

            if ($request->priority) {
                $query->where('priority', $request->priority);
            }

            if ($request->assigned_to) {
                $query->where('assigned_to', $request->assigned_to);
            }

            $tasks = $query->paginate(10);

            return response()->json($tasks);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to retrieve tasks',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request, $team_id)
    {
        try {

            $team = Team::find($team_id);

            if (!$team) {
                return response()->json([
                    'message' => 'Team not found'
                ], 404);
            }

            $user = auth()->user();

           
            if ($user->role === 'member') {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'required|in:low,medium,high',
                'assigned_to' => 'required|exists:users,id',
                'due_date' => 'required|date',
            ]);

           
            $isMember = $team->members()
                ->where('users.id', $validated['assigned_to'])
                ->exists();

            if (!$isMember) {
                return response()->json([
                    'message' => 'Assigned user does not belong to this team'
                ], 422);
            }

            if (
                $user->role === 'manager' &&
                !$team->members()
                    ->where('users.id', $user->id)
                    ->exists()
            ) {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            $task = Task::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'priority' => $validated['priority'],
                'assigned_to' => $validated['assigned_to'],
                'due_date' => $validated['due_date'],
                'team_id' => $team_id,
                'created_by' => $user->id,
                'status' => 'pending',
            ]);

            return response()->json([
                'message' => 'Task created successfully',
                'task' => $task,
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

            $task = Task::with([
                'assignedUser',
                'creator',
                'team'
            ])->find($id);

            if (!$task) {
                return response()->json([
                    'message' => 'Task not found'
                ], 404);
            }

            $user = auth()->user();

            if (
                $user->role === 'member' &&
                $task->assigned_to !== $user->id
            ) {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            if ($user->role === 'manager') {

                $belongsToTeam = $user->teams()
                    ->where('teams.id', $task->team_id)
                    ->exists();

                if (!$belongsToTeam) {
                    return response()->json([
                        'message' => 'Forbidden'
                    ], 403);
                }
            }

            return response()->json($task);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to retrieve task',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $task = Task::find($id);

            if (!$task) {
                return response()->json([
                    'message' => 'Task not found'
                ], 404);
            }

            $user = auth()->user();

            if (
                $user->role === 'member' &&
                $task->assigned_to !== $user->id
            ) {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            if ($user->role === 'manager') {

                $belongsToTeam = $user->teams()
                    ->where('teams.id', $task->team_id)
                    ->exists();

                if (!$belongsToTeam) {
                    return response()->json([
                        'message' => 'Forbidden'
                    ], 403);
                }
            }

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
                'priority' => 'sometimes|in:low,medium,high',
                'assigned_to' => 'sometimes|exists:users,id',
                'due_date' => 'sometimes|date',
            ]);

       
            if (isset($validated['assigned_to'])) {

                $team = Team::find($task->team_id);

                $isMember = $team->members()
                    ->where('users.id', $validated['assigned_to'])
                    ->exists();

                if (!$isMember) {
                    return response()->json([
                        'message' => 'Assigned user does not belong to this team'
                    ], 422);
                }
            }

            $task->update($validated);

            return response()->json([
                'message' => 'Task updated successfully',
                'task' => $task
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {

            throw $e;

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {

            $task = Task::find($id);

            if (!$task) {
                return response()->json([
                    'message' => 'Task not found'
                ], 404);
            }

            $user = auth()->user();

            if (
                $user->role !== 'admin' &&
                $task->created_by !== $user->id
            ) {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            $task->delete();

            return response()->json([
                'message' => 'Task deleted successfully'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to delete task',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {

            $task = Task::find($id);

            if (!$task) {
                return response()->json([
                    'message' => 'Task not found'
                ], 404);
            }

            $user = auth()->user();

            if (
                $user->role === 'member' &&
                $task->assigned_to !== $user->id
            ) {
                return response()->json([
                    'message' => 'Forbidden'
                ], 403);
            }

            if ($user->role === 'manager') {

                $belongsToTeam = $user->teams()
                    ->where('teams.id', $task->team_id)
                    ->exists();

                if (!$belongsToTeam) {
                    return response()->json([
                        'message' => 'Forbidden'
                    ], 403);
                }
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,in_progress,completed,cancelled'
            ]);

            $currentStatus = $task->status;
            $newStatus = $validated['status'];

            $allowedTransitions = [
                'pending' => [
                    'in_progress',
                    'cancelled'
                ],
                'in_progress' => [
                    'completed',
                    'pending'
                ],
                'completed' => [],
                'cancelled' => [],
            ];

            if (!in_array(
                $newStatus,
                $allowedTransitions[$currentStatus]
            )) {
                return response()->json([
                    'message' => 'Invalid status transition'
                ], 422);
            }

            $task->update([
                'status' => $newStatus
            ]);

            return response()->json([
                'message' => 'Task status updated successfully',
                'task' => $task
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {

            throw $e;

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}

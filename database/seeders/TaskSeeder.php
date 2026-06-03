<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\Team;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $teams = Team::with('members')->get();

        foreach ($teams as $team) {

            for ($i = 0; $i < 10; $i++) {

                $assignedUser = $team->members->random();

                Task::create([
                    'title' => fake()->sentence(3),
                    'description' => fake()->paragraph(),
                    'status' => fake()->randomElement([
                        'pending',
                        'in_progress',
                        'completed'
                    ]),
                    'priority' => fake()->randomElement([
                        'low',
                        'medium',
                        'high'
                    ]),
                    'assigned_to' => $assignedUser->id,
                    'created_by' => $team->created_by,
                    'team_id' => $team->id,
                    'due_date' => fake()->dateTimeBetween('now', '+30 days'),
                ]);
            }
        }
    }
}
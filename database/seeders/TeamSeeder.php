<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $managers = User::where('role', 'manager')->get();
        $members = User::where('role', 'member')->get();

        foreach ($managers as $manager) {

            $team = Team::create([
                'name' => fake()->company() . ' Team',
                'created_by' => $manager->id,
            ]);

            TeamMember::create([
                'team_id' => $team->id,
                'user_id' => $manager->id,
                'role' => 'lead',
            ]);

            foreach ($members->random(3) as $member) {
                TeamMember::firstOrCreate([
                    'team_id' => $team->id,
                    'user_id' => $member->id,
                ], [
                    'role' => 'member',
                ]);
            }
        }
    }
}
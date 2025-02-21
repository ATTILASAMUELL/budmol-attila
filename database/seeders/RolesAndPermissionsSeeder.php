<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::create(['name' => 'create events', 'guard_name' => 'api']);
        Permission::create(['name' => 'view events', 'guard_name' => 'api']);
        Permission::create(['name' => 'edit events', 'guard_name' => 'api']);
        Permission::create(['name' => 'delete events', 'guard_name' => 'api']);
        Permission::create(['name' => 'view registrations', 'guard_name' => 'api']);
        Permission::create(['name' => 'register events', 'guard_name' => 'api']);

        $administrator = Role::create(['name' => 'administrator', 'guard_name' => 'api']);
        $participant   = Role::create(['name' => 'participant', 'guard_name' => 'api']);

        $administrator->givePermissionTo([
            'create events',
            'view events',
            'edit events',
            'delete events',
            'view registrations',
        ]);

        $participant->givePermissionTo([
            'view events',
            'register events',
        ]);
    }
}

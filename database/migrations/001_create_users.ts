import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary();

    table.uuid('uuid').notNullable().unique();

    table.string('first_name', 100).notNullable();

    table.string('last_name', 100).notNullable();

    table.string('email', 255).notNullable().unique();

    table.string('phone_number', 20).notNullable().unique();

    table.string('password_hash').notNullable();

    table.boolean('is_active').defaultTo(true);

    table.timestamps(true, true);

  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
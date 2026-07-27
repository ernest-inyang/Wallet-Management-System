import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wallets', (table) => {
    table.bigIncrements('id').primary();

    table.uuid('uuid').notNullable().unique();

    table
      .bigInteger('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.decimal('balance', 18, 2).notNullable().defaultTo(0);

    table.string('currency', 3).defaultTo('NGN');

    table.boolean('is_active').defaultTo(true);

    table.timestamps(true, true);

    table.unique(['user_id']);

  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('wallets');
}
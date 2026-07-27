import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table
      .bigInteger('user_id')
      .unsigned()
      .notNullable()
      .after('wallet_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .bigInteger('related_user_id')
      .unsigned()
      .nullable()
      .after('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });

  await knex.schema.alterTable('transactions', (table) => {
    table.index(['user_id']);
    table.index(['related_user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropIndex(['user_id']);
    table.dropIndex(['related_user_id']);

    table.dropColumn('related_user_id');
    table.dropColumn('user_id');
  });
}
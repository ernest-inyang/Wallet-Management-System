import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.bigIncrements('id').primary();

        table.uuid('uuid').notNullable().unique();

        table.string('reference', 80).notNullable().index();

        table
            .bigInteger('wallet_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('wallets')
            .onDelete('CASCADE');

        table.enum('type', [
            'FUND',
            'TRANSFER',
            'WITHDRAW',
        ]);

        table.enum('direction', [
            'CREDIT',
            'DEBIT',
        ]);

        table.enum('status', [
            'PENDING',
            'SUCCESS',
            'FAILED',
            'REVERSED',
        ]);

        table.decimal('amount', 18, 2).notNullable();

        table.decimal('balance_before', 18, 2).notNullable();

        table.decimal('balance_after', 18, 2).notNullable();

        table.string('description', 255);

        table.json('metadata');

        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.index(['wallet_id']);

        table.index(['created_at']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
}
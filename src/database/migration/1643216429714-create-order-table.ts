import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createOrderTable1643216429714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'consumerId',
            type: 'varchar',
          },
          {
            name: 'lineItems',
            type: 'text',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'version',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'order-outbox',
        columns: [
          {
            name: 'transactionId',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'operationType',
            type: 'varchar',
          },
          {
            name: 'orderId',
            type: 'varchar',
          },
          {
            name: 'sentDate',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order');
    await queryRunner.dropTable('order-outbox');
  }
}

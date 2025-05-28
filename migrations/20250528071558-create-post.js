'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Post', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
    threadId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Thread',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    refId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Post',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Post');
}
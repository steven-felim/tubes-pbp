'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Thread', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
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
    title: {
      type: Sequelize.STRING,
      allowNull: false,
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

  await queryInterface.createTable('ThreadCategory', {
    threadId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Thread',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    categoryName: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Category',
        key: 'name',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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

  await queryInterface.addConstraint('ThreadCategory', {
    fields: ['threadId', 'categoryName'],
    type: 'unique',
    name: 'thread_category_unique',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('ThreadCategory');
  await queryInterface.dropTable('Thread');
}
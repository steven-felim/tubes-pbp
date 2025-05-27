'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Category', {
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Category');
}
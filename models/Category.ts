import { Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@Table({
    tableName: "Category",
})

export class Category extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;
}
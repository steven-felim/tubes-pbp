import { Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@Table({
    tableName: "Session",
    timestamps: false
})

export class Session extends Model {
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
  declare userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;
}
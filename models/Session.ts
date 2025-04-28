import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";

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

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;
}
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Thread } from "./Thread";
import { ThreadCategory } from "./ThreadCategory";

@Table({ tableName: "Category" })
export class Category extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  declare name: string;

  @BelongsToMany(() => Thread, () => ThreadCategory)
  declare threads: Thread[];
}

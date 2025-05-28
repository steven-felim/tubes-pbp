import { Column,  DataType,  ForeignKey,  Model,  Table, PrimaryKey } from "sequelize-typescript";
import { Thread } from "./Thread";
import { Category } from "./Category";

@Table({ tableName: "ThreadCategory", timestamps: false })
export class ThreadCategory extends Model {
  @PrimaryKey
  @ForeignKey(() => Thread)
  @Column(DataType.UUID)
  declare threadId: string;

  @PrimaryKey
  @ForeignKey(() => Category)
  @Column(DataType.STRING)
  declare categoryName: string;
}
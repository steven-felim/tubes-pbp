import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Thread } from "./Thread";
import { Category } from "./Category";

@Table({ tableName: "thread_categories", timestamps: false })
export class ThreadCategory extends Model {
  @ForeignKey(() => Thread)
  @Column(DataType.UUID)
  declare threadId: string;

  @ForeignKey(() => Category)
  @Column(DataType.UUID)
  declare categoryId: string;
}

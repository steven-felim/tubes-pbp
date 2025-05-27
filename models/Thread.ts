import { BelongsTo, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";
import { Category } from "./Category";
import { ThreadCategory } from "./ThreadCategory";

@Table({
    tableName: "Thread",
})
export class Thread extends Model {
    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: uuidv4,
    })
    declare id: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare userId: string;

    @BelongsTo(() => User, "userId")
    declare user: User;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare title: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare content: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    declare categoryId: string;

      @BelongsToMany(() => Category, () => ThreadCategory)
    declare categories: Category[];

    @Column({
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare createdAt: Date;

    @Column({
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare updatedAt: Date;
}

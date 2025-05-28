import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";
import { Thread } from "./Thread";

@Table({
    tableName: "Post",
})
export class Post extends Model {
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
    declare threadId: string;

    @BelongsTo(() => Thread, "threadId")
    declare thread: Thread;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare userId: string;

    @BelongsTo(() => User, "userId")
    declare user: User;

    @Column({
        allowNull: false,
        type: DataType.UUIDV4,
    })
    declare refId: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare content: string;

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

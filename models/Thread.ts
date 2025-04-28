import { Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

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
        allowNull: false,
        type: DataType.STRING,
    })
    declare categoryId: string;

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

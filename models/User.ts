import { Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@Table({
    tableName: "User",
})
export class User extends Model {
    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: uuidv4,
    })
    declare id: string;

    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING,
    })
    declare name: string;

    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING,
    })
    declare email: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare password: string;

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
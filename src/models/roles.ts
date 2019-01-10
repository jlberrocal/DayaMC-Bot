import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table
export class Roles extends Model<Roles> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id?: number;

    @Column(DataType.TEXT)
    name?: string;

    @Column(DataType.TEXT)
    guild?: string;
}

import {AutoIncrement, Column, DataType, Max, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table
export class Match extends Model<Match> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id?: number;

    @Column(DataType.TEXT)
    player?: string;

    @Column(DataType.TEXT)
    code?: string;
}
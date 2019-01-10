import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table
export class AudioChannel extends Model<AudioChannel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id?: number;

    @Column(DataType.TEXT)
    channelId?: string;

    @Column(DataType.TEXT)
    guild?: string;
}
import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table
export class BotChannel extends Model<BotChannel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id?: number;

    @Column(DataType.TEXT)
    channelId?: string;

    @Column(DataType.TEXT)
    guild?: string;

    @Column(DataType.ENUM('Voice', 'Commands', 'Codes'))
    type?: 'Voice' | 'Commands' | 'Codes';
}
// import { Exclude } from 'class-transformer';
// import { User } from '../auth/user.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../auth/user.entity";

@Table
export class Post extends Model {
  @Column
  title: string;

  @Column
  content: string;

  @Column
  creationDate: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  author: number;

  @BelongsTo(() => User)
  user: User;
}

import type { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

export const [readSequelize, writeSequelize] = [new Sequelize('sqlite:chattts.db', {
  logging: false,
}), new Sequelize('sqlite:chattts.db', {
  logging: false,
})];

// task model

interface TaskModel extends Model<InferAttributes<TaskModel>, InferCreationAttributes<TaskModel>> {
  id: CreationOptional<number>
  /** 0-未开始 1-进行中 2-已完成 -1-失败 */
  status: 0 | 1 | 2 | -1
  content: string
  seed: number
  savedName: string
  /** 0-未删除 1-已删除 */
  deleted: 0 | 1
}

export const [readTask, writeTask] = [readSequelize, writeSequelize].map((sequelize) => {
  return sequelize.define<TaskModel>('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: DataTypes.NUMBER,
    content: DataTypes.STRING,
    seed: DataTypes.NUMBER,
    savedName: DataTypes.STRING,
    deleted: DataTypes.NUMBER,
  });
});

// timbre model

interface TimbreModel extends Model<InferAttributes<TimbreModel>, InferCreationAttributes<TimbreModel>> {
  /** seed */
  id: number
  remark: string
}

export const [readTimbre, writeTimbre] = [readSequelize, writeSequelize].map((sequelize) => {
  return sequelize.define<TimbreModel>('Timbre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    remark: DataTypes.STRING,
  });
});

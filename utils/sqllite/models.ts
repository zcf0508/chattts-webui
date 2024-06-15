import type { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

export const [readSequelize, writeSequelize] = [new Sequelize('sqlite:chattts.db'), new Sequelize('sqlite:chattts.db')];

interface TaskModel extends Model<InferAttributes<TaskModel>, InferCreationAttributes<TaskModel>> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>
  /** 0-未开始 1-进行中 2-已完成 -1-失败 */
  status: number
  content: string
  seed: number
  savedName: string
}

export const [readTask, writeTask] = (() => {
  return [readSequelize, writeSequelize].map((sequelize) => {
    return sequelize.define<TaskModel>('Task', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      status: {
        type: DataTypes.NUMBER,
      },
      content: DataTypes.STRING,
      seed: DataTypes.NUMBER,
      savedName: DataTypes.STRING,
    });
  });
})();

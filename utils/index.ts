/**
 * 0-未开始 1-进行中 2-已完成 -1-失败
 */
export function statusLabel(status: number) {
  switch (status) {
    case 0:
      return '未开始';
    case 1:
      return '进行中';
    case 2:
      return '已完成';
    case -1:
      return '失败';
    default:
      return '';
  }
}

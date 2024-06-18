import { read, utils } from 'xlsx';

export function useReadCsv<T>() {
  const fileInputRef = ref<HTMLInputElement>();
  const data = ref<T[]>([]);
  const error = ref<Error>();

  const parseCSV = (_data: string | ArrayBuffer) => {
    const workbook = read(_data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      error.value = new Error('文件格式错误');
      return;
    }
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      error.value = new Error('空文件');
      return;
    }
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 }) as any[];
    const keys = jsonData[0] as string[];
    data.value = jsonData.slice(1).map((row) => {
      const obj: any = {};
      keys.forEach((key, index) => {
        obj[key] = row[index];
      });
      return obj;
    });
  };

  const createFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        parseCSV(e.target?.result);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onFileChange = (e: Event) => {
    data.value = [];
    error.value = undefined;
    const files = (e.target as HTMLInputElement)?.files || (e as InputEvent)?.dataTransfer?.files;
    if (!files || !files.length) {
      error.value = new Error('请选择文档');
      return;
    }
    createFile(files[0]!);
  };

  function uploadFile() {
    fileInputRef.value?.click();
  }

  return {
    fileInputRef,
    onFileChange,
    uploadFile,
    data,
    error,
  };
}

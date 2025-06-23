// utils/array.ts
export const swapArrayElements = <T>(arr: T[], index1: number, index2: number): T[] => {
    const newArr = [...arr];
    [newArr[index1], newArr[index2]] = [newArr[index2], newArr[index1]];
    return newArr;
  };
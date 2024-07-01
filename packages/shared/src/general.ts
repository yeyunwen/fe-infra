export const isArrary = Array.isArray;

export const upperFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isChinese = (str: string) => {
  return /[\u4e00-\u9fa5]/.test(str);
};

export const a = 1;

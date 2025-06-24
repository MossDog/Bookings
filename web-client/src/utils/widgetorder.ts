export const moveItemUp = <T>(arr: T[], index: number): T[] => {
    if (index === 0) return arr;
    const updated = [...arr];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    return updated;
  };
  
  export const moveItemDown = <T>(arr: T[], index: number): T[] => {
    if (index === arr.length - 1) return arr;
    const updated = [...arr];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    return updated;
  };
  
  export const moveItemTop = <T>(arr: T[], index: number): T[] => {
    if (index === 0) return arr;
    const updated = [...arr];
    const [moved] = updated.splice(index, 1);
    updated.unshift(moved);
    return updated;
  };
  
  export const moveItemBottom = <T>(arr: T[], index: number): T[] => {
    if (index === arr.length - 1) return arr;
    const updated = [...arr];
    const [moved] = updated.splice(index, 1);
    updated.push(moved);
    return updated;
  };
  
  export const removeItem = <T>(arr: T[], item: T): T[] =>
    arr.filter((i) => i !== item);
  
  export const addItem = <T>(arr: T[], item: T): T[] => [...arr, item];

  export const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
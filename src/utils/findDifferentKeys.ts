export function findDifferentKeys(obj1: any, obj2: any, keysToCheck: any[]) {
  const result: any = {};

  for (const key of keysToCheck) {
    if (JSON.stringify(obj1[key]) != JSON.stringify(obj2[key])) {
      result[key] = obj2[key];
    }
  }

  return result;
}
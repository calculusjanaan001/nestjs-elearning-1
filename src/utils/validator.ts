function isObjectIdValid(toCheck: string) {
  const regx = new RegExp('^[0-9a-fA-F]{24}$');

  return regx.test(toCheck);
}

export { isObjectIdValid };

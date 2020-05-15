function sluggify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-');
}

export { sluggify };

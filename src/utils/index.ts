const sleep = async ({ delay = 1000 }) => {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, delay);
  });
};

export { sleep };

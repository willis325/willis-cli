import { Ora } from 'ora';

/**
 * spinner.info 打印异步执行结果
 * @param spinner Ora
 * @param promise Promise<string>
 * @return spinner.info(string)
 */
export const spinnerInfoPromise = async (spinner: Ora, promise: Promise<string>) => {
  const value = await promise;
  spinner.info(value);
};

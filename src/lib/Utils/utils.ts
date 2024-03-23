/**
 * Input: /src/Commands/blah
 * Output: ./dist/src/Commands/blah
 */
export function formatPath(path: string): string {
  if (process.env.NODE_ENV === "development") {
    return `./${path.replace(".", "")}`;
  } else {
    if (path.search(".")) {
      return `./dist/${path.replace(".", "")}`;
    }

    return `./dist/${path}`;
  }
}

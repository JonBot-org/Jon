import chalk from "chalk";
import moment from "moment";

export class Logger {
  /**
   * Log stuff.
   */
  public constructor() {
  }

  public info(str: string) {
    console.log(
      chalk.redBright(`[${this.time()}]`),
      chalk.yellowBright("::"),
      str
    );
  }

  public debug(message: string) {
    console.log(
      chalk.redBright(`[${this.time()}]`),
      chalk.yellowBright('::'),
      chalk.grey(message)
    )
  }

  public error(error: Error | unknown, level = 0) {
    const log = () => {
      console.log(
        chalk.redBright(`[${this.time()}]`),
        chalk.yellowBright('::'),
        error
      )
    }


    if (level === 0) {
      log();
      return;
    } else {
      log();
      // Do more here.
      return;
    }

    
  }

  public time(): string {
    return `${moment().format("M/D h:mm")}`;
  }
}

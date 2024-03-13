import chalk from "chalk";
import moment from "moment";

export class Logger {
  /**
   * Log stuff.
   */
  public constructor(time?: boolean) {
    if (!time) console.log("Logger");
  }

  public info(str: string) {
    console.log(
      chalk.redBright(`[${this.time()}]`),
      chalk.yellowBright("::"),
      chalk.greenBright(str),
    );
  }

  public time(): string {
    const date = new Date();
    return `${moment().format("M/D h:mm")}`;
  }
}

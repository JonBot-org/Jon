import chalk from "chalk";
import { EmbedBuilder, WebhookClient, codeBlock } from "discord.js";
import moment from "moment";
import { JonBot } from "../index.m";

export class Logger {
  /**
   * Log stuff.
   */
  public constructor() {}

  public info(str: string) {
    console.log(
      chalk.green("[INFO] ->"),
      chalk.redBright(`${this.time()}:`),
      str,
    );
  }

  public debug(message: string) {
    console.log(
      chalk.whiteBright("[DEBUG] ->"),
      chalk.redBright(`${this.time()}:`),
      message,
    );
  }

  public error(error: Error | unknown, level = 0) {
    const log = () => {
      console.log(
        chalk.yellowBright("[ERROR] ->"),
        chalk.redBright(`${this.time()}:`),
        error,
      );
    };

    if (level === 0) {
      log();
      return;
    } else {
      log();
      if (process.env.NODE_ENV === "development") return;
      if (process.env.LOGGING_WEBHOOK === undefined) return;

      const webhook = new WebhookClient({ url: process.env.LOGGING_WEBHOOK });
      const embed = new EmbedBuilder()
        .setDescription(
          `**Logged Error!**\n- Level: ${level}\n- Logged Time: ${this.time()}\n- Error:\n${codeBlock(
            `${error}`,
          )}`,
        )
        .setColor("Orange")
        .setTimestamp();

      webhook.send({ embeds: [embed], username: "Jon" }).catch(console.error);
      return;
    }
  }

  public time(): string {
    return `${moment().format("D/h:mn:ss")}`;
  }
}

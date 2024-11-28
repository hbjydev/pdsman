import { Command } from '@cliffy/command';
import { listCmd } from "./list.ts";

export const accountCmd = new Command()
  .name("accounts")
  .description("Account manipulation utilities")
  .action(() => accountCmd.showHelp())
  .command("list", listCmd);

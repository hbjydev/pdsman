import { type ActionHandler, Command } from '@cliffy/command';
import { listCmd } from "./list";
import { createCmd } from './create';
import { changeHandleCmd } from './change-handle';
import { deleteCmd } from './delete';
import { passwordResetCmd } from './reset-password';
import { changeEmailCmd } from './change-email';

export const accountCmd = new Command()
  .name("accounts")
  .description("Account manipulation utilities")
  .action((() => { accountCmd.showHelp(); }) as ActionHandler)
  .command("list", listCmd)
  .command("delete", deleteCmd)
  .command("change-handle", changeHandleCmd)
  .command("change-email", changeEmailCmd)
  .command("reset-password", passwordResetCmd)
  .command("create", createCmd);

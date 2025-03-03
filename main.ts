import { type ActionHandler, Command } from '@cliffy/command';
import { accountCmd } from "./accounts/mod";
import { requestCrawlCmd } from "./relay_crawl";
import { createInviteCodeCmd } from "./create_invite_code";

const cmd = new Command()
  .name("pdsman")
  .description("A simple ATProto PDS administration tool.")
  .version("v0.2.0")
  .globalOption("-s, --server <server:string>", "The PDS to connect to.", { default: 'http://localhost:2583' })
  .globalOption("-p, --admin-password <adminPassword:string>", "The admin password for the PDS.", {
    default: process.env["PDS_ADMIN_PASSWORD"] ?? undefined,
  })
  .action((() => { cmd.showHelp(); }) as ActionHandler)
  .command('accounts', accountCmd)
  .command('request-crawl', requestCrawlCmd)
  .command('create-invite-code', createInviteCodeCmd);

if (import.meta.main) {
  Bun.argv.shift();
  Bun.argv.shift();
  cmd.parse(Bun.argv);
}

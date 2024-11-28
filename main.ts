import { Command } from '@cliffy/command';
import { accountCmd } from "./accounts/mod.ts";
import { requestCrawlCmd } from "./relay_crawl.ts";

const cmd = new Command()
  .name("pdsman")
  .description("A simple ATProto PDS administration tool.")
  .version("v0.1.0")
  .globalOption("-s, --server <server:string>", "The PDS to connect to.", { default: 'http://localhost:2583' })
  .globalOption("-p, --admin-password <adminPassword:string>", "The admin password for the PDS.")
  .action(() => cmd.showHelp())
  .command('accounts', accountCmd)
  .command('request-crawl', requestCrawlCmd);

if (import.meta.main) await cmd.parse(Deno.args);

import { Command } from "@cliffy/command";
import { GlobalOpts } from "../types.ts";
import { colors } from "@cliffy/ansi/colors";
import { Table } from "@cliffy/table";
import { encodeBase64 } from "@std/encoding/base64";
import { CredentialManager } from "@atcute/client";
import { XRPC, XRPCResponse } from "@atcute/client";

export const listCmd = new Command()
  .name("list")
  .description("List accounts associated with the given PDS.")
  .option("-p, --admin-password <adminPassword:string>", "The admin password for the PDS.", { required: true })
  .action(async ({ server, adminPassword }: GlobalOpts) => {
    console.log(`🛜 Requesting repo list from ${server}...`);
    const manager = new CredentialManager({ service: `${server}` });
    const rpc = new XRPC({ handler: manager });

    try {
      const res = await rpc.request({
        type: 'get',
        nsid: 'com.atproto.sync.listRepos',
        params: { limit: 100 },
      }) as XRPCResponse<{ cursor: string; repos: { did: string; head: string; rev: string; active: boolean; }[]; }>;

      const authStr = encodeBase64(`admin:${adminPassword}`);

      const records: string[][] = [];

      for (const repo of res.data.repos) {
        const accountInfo = await rpc.request({
          type: 'get',
          nsid: 'com.atproto.admin.getAccountInfo',
          params: { did: repo.did },
          headers: {
            'Authorization': `Basic ${authStr}`,
          },
        }) as XRPCResponse<{ did: string; handle: string; email: string; }>;

        records.push([ accountInfo.data.did, accountInfo.data.handle, accountInfo.data.email ]);
      }

      const table = Table.from(records);
      table.header([colors.bold.underline.blue('DID'), colors.bold.underline.blue('Handle'), colors.bold.underline.blue('Email')])
      table.padding(1);
      table.border(true);
      table.render();

      console.log(`✅ Repo list request to ${server} successful!`);
    } catch(e) {
      console.error(`❌ Failed to send repo list request to ${server}:\n\n`, e);
    }
  });

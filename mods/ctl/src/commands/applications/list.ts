/* eslint-disable import/no-unresolved */
/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as SDK from "@fonoster/sdk";
import { Flags } from "@oclif/core";
import cliui from "cliui";
import { BaseCommand } from "../../BaseCommand";
import { getConfig } from "../../config";
import { CONFIG_FILE } from "../../constants";

export default class List extends BaseCommand<typeof List> {
  static override description = "list all existing Applications";
  static override examples = ["<%= config.bin %> <%= command.id %>"];
  static override flags = {
    "page-size": Flags.string({
      char: "s",
      description: "the number of items to show",
      default: "1000",
      required: false
    })
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(List);
    const workspaces = getConfig(CONFIG_FILE);
    const currentWorkspace = workspaces.find((w) => w.active);

    if (!currentWorkspace) {
      this.error("No active workspace found.");
    }

    const client = new SDK.Client({
      endpoint: currentWorkspace.endpoint,
      accessKeyId: `WO${currentWorkspace.workspaceRef.replaceAll("-", "")}`,
      allowInsecure: flags.insecure
    });

    await client.loginWithApiKey(
      currentWorkspace.accessKeyId,
      currentWorkspace.accessKeySecret
    );

    const applications = new SDK.Applications(client);
    const response = await applications.listApplications({
      pageSize: parseInt(flags["page-size"]),
      pageToken: ""
    });

    const ui = cliui({ width: 170 });

    ui.div(
      { text: "REF", padding: [0, 0, 0, 0], width: 40 },
      { text: "NAME", padding: [0, 0, 0, 0], width: 30 },
      { text: "TYPE", padding: [0, 0, 0, 0], width: 10 },
      { text: "ENDPOINT", padding: [0, 0, 0, 0] }
    );

    response.items.forEach((application) => {
      ui.div(
        { text: application.ref, padding: [0, 0, 0, 0], width: 40 },
        { text: application.name, padding: [0, 0, 0, 0], width: 30 },
        { text: application.type, padding: [0, 0, 0, 0], width: 10 },
        { text: application.endpoint, padding: [0, 0, 0, 0] }
      );
    });

    this.log(ui.toString());
  }
}

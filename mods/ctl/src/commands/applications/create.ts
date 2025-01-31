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
import { CreateApplicationRequest } from "@fonoster/types";
import { confirm, input, select } from "@inquirer/prompts";
import { BaseCommand } from "../../BaseCommand";
import { getConfig } from "../../config";
import { CONFIG_FILE } from "../../constants";

export default class Create extends BaseCommand<typeof Create> {
  static override description = "create a new Application";
  static override examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const { flags } = await this.parse(Create);
    const workspaces = getConfig(CONFIG_FILE);
    const currentWorkspace = workspaces.find((w) => w.active);

    if (!currentWorkspace) {
      this.error("No active workspace found.");
    }

    this.log("This utility will help you create an Application.");
    this.log("Press ^C at any time to quit.");

    const answers = {
      name: await input({
        message: "Name",
        required: true
      }),
      type: await select({
        message: "Type",
        choices: [{ name: "External", value: "External" }]
      }),
      endpoint: await input({
        message: "Endpoint",
        required: true
      }),
      speechToText: {
        productRef: await select({
          message: "SST Vendor",
          choices: [{ name: "Deepgram", value: "stt.deepgram" }]
        }),
        config: {
          languageCode: await select({
            message: "STT Language",
            choices: [
              { name: "English", value: "en-US" },
              { name: "Spanish", value: "es-ES" }
            ]
          }),
          model: await select({
            message: "STT Model",
            choices: [
              { name: "Nova 2", value: "nova-2" },
              { name: "Nova 2 Phone Call", value: "nova-2-phonecall" },
              {
                name: "Nova 2 Conversational AI",
                value: "nova-2-conversationalai"
              }
            ],
            default: "nova-2"
          })
        }
      },
      textToSpeech: {
        productRef: await select({
          message: "TTV Vendor",
          choices: [
            { name: "Deepgram", value: "tts.deepgram" },
            { name: "ElevenLabs", value: "tts.elevenlabs" },
            { name: "Google", value: "tts.google" },
            { name: "Azure", value: "tts.azure" }
          ]
        }),
        config: {
          voice: await input({
            message: "TTS Voice",
            required: true
          })
        }
      },
      confirm: await confirm({
        message: "Ready?"
      })
    };

    if (!answers.confirm) {
      this.log("Aborted!");
      return;
    }

    try {
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
      await applications.createApplication(
        answers as unknown as CreateApplicationRequest
      );

      this.log("Done!");
    } catch (e) {
      this.error(e);
    }
  }
}

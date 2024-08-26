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
import { PlaybackControlAction } from "@fonoster/common";
import { getLogger } from "@fonoster/logger";
import { v4 as uuidv4 } from "uuid";
import { setup } from "xstate";
import { types } from "./types";

const logger = getLogger({ service: "autopilot", filePath: __filename });

const machine = setup({
  types,
  actions: {
    sendGreeting: async function ({ context }) {
      await context.voice.answer();
      await context.voice.say(context.firstMessage, {
        playbackRef: context.playbackRef
      });
    },
    interruptMachineSpeaking: async function ({ context }) {
      logger.verbose("interrupting the machine", {
        playbackRef: context.playbackRef
      });
      await context.voice.playbackControl(
        context.playbackRef,
        PlaybackControlAction.STOP
      );
    },
    appendSpeech: function ({ context, event }) {
      const speech = (event as { speech: string }).speech;
      context.speechBuffer = (context.speechBuffer || "") + " " + speech;

      context.speechResponseStartTime = Date.now();

      logger.verbose("appended speech", { speechBuffer: context.speechBuffer });
    },
    processHumanRequest: async function ({ context }) {
      const speech = context.speechBuffer.trim();
      logger.verbose("processing human request", { speech });

      const response = await context.assistant.invoke({
        text: speech
      });

      const speechResponseTime = Date.now() - context.speechResponseStartTime;

      context.speechResponseTime = speechResponseTime;

      logger.verbose("assistant response", {
        response,
        responseTime: speechResponseTime
      });

      await context.voice.say(response, { playbackRef: context.playbackRef });

      // Clear the speech buffer and reset response timing
      context.speechBuffer = "";
      context.speechResponseStartTime = 0;
    },
    hangup: async function ({ context }) {
      await context.voice.hangup();
    }
  },
  guards: {
    hasSpeechBuffer: function ({ context }) {
      return context.speechBuffer?.trim().length > 0;
    }
  }
}).createMachine({
  context: ({ input }) => ({
    firstMessage: input.firstMessage,
    voice: input.voice,
    assistant: input.assistant,
    playbackRef: uuidv4(),
    speechBuffer: "",
    speechResponseStartTime: 0,
    speechResponseTime: 0
  }),
  id: "fnAI_v0",
  initial: "welcome",
  states: {
    welcome: {
      entry: {
        type: "sendGreeting"
      },
      always: {
        target: "machineListening"
      },
      description: "The initial state where the AI greets the Human."
    },
    machineListening: {
      on: {
        SPEECH_START: {
          target: "humanSpeaking",
          description: "This must be triggered by a VAD or similar system."
        },
        HUMAN_PROMPT: {
          actions: { type: "appendSpeech" },
          description: "Appends the speech to the buffer."
        }
      },
      description:
        "The state where the AI is actively listening in conversation."
    },
    humanSpeaking: {
      entry: {
        type: "interruptMachineSpeaking"
      },
      on: {
        HUMAN_PROMPT: {
          actions: { type: "appendSpeech" },
          description: "Appends the speech to the buffer."
        },
        SPEECH_END: {
          target: "machineListening",
          actions: { type: "processHumanRequest" },
          guard: { type: "hasSpeechBuffer" },
          description: "This must be triggered by a VAD or similar system."
        }
      },
      description:
        "The state where the AI detects Human speech while it is speaking."
    },
    hangup: {
      type: "final",
      entry: {
        type: "hangup"
      },
      on: {
        SESSION_END: {
          target: "hangup"
        }
      },
      description:
        "The final state where the AI terminates the conversation due to inactivity."
    }
  }
});

export { machine };

##
# Build stage
##
FROM node:20-slim AS builder
LABEL Fonoster Team <team@fonoster.com>

WORKDIR /work
COPY . .

RUN npm rebuild

##
# Run stage
##
FROM node:20-slim

ENV ASSISTANT /opt/fonoster/assistant.json

RUN groupadd -r appuser && useradd -r -g appuser -m -d /home/appuser appuser

COPY --from=builder --chown=appuser:appuser /work/mods/autopilot/dist /home/appuser/autopilot/dist
COPY --from=builder --chown=appuser:appuser /work/mods/autopilot/package.json /home/appuser/autopilot/package.json
COPY --from=builder --chown=appuser:appuser /work/mods/autopilot/node_modules /home/appuser/autopilot/node_modules
COPY --from=builder --chown=appuser:appuser /work/mods/autopilot/silero_vad.onnx /home/appuser/autopilot/silero_vad.onnx

WORKDIR /home/appuser/autopilot

# Workaround for missing voice module
RUN npm install @fonoster/voice

USER appuser

CMD ["node", "/home/appuser/autopilot/dist/server.js"]

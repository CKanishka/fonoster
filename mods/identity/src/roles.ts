/* eslint-disable sonarjs/no-duplicate-string */
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
import { ApiRoleEnum } from "./apikeys/ApiRoleEnum";
import { Role } from "./exchanges/types";
import { WorkspaceRoleEnum } from "./workspaces/WorkspaceRoleEnum";

const workspaceAccess = [
  "/fonoster.applications.v1beta2.Applications/CreateApplication",
  "/fonoster.applications.v1beta2.Applications/UpdateApplication",
  "/fonoster.applications.v1beta2.Applications/GetApplication",
  "/fonoster.applications.v1beta2.Applications/DeleteApplication",
  "/fonoster.applications.v1beta2.Applications/ListApplications",
  "/fonoster.agents.v1beta2.Agents/CreateAgent",
  "/fonoster.agents.v1beta2.Agents/UpdateAgent",
  "/fonoster.agents.v1beta2.Agents/GetAgent",
  "/fonoster.agents.v1beta2.Agents/DeleteAgent",
  "/fonoster.agents.v1beta2.Agents/ListAgents",
  "/fonoster.acls.v1beta2.Acls/CreateAcl",
  "/fonoster.acls.v1beta2.Acls/UpdateAcl",
  "/fonoster.acls.v1beta2.Acls/ListAcls",
  "/fonoster.acls.v1beta2.Acls/GetAcl",
  "/fonoster.acls.v1beta2.Acls/DeleteAcl",
  "/fonoster.credentials.v1beta2.CredentialsService/CreateCredentials",
  "/fonoster.credentials.v1beta2.CredentialsService/UpdateCredentials",
  "/fonoster.credentials.v1beta2.CredentialsService/GetCredentials",
  "/fonoster.credentials.v1beta2.CredentialsService/DeleteCredentials",
  "/fonoster.credentials.v1beta2.CredentialsService/ListCredentials",
  "/fonoster.domains.v1beta2.Domains/CreateDomain",
  "/fonoster.domains.v1beta2.Domains/UpdateDomain",
  "/fonoster.domains.v1beta2.Domains/GetDomain",
  "/fonoster.domains.v1beta2.Domains/DeleteDomain",
  "/fonoster.domains.v1beta2.Domains/ListDomains",
  "/fonoster.trunks.v1beta2.Trunks/CreateTrunk",
  "/fonoster.trunks.v1beta2.Trunks/UpdateTrunk",
  "/fonoster.trunks.v1beta2.Trunks/GetTrunk",
  "/fonoster.trunks.v1beta2.Trunks/DeleteTrunk",
  "/fonoster.trunks.v1beta2.Trunks/ListTrunks",
  "/fonoster.numbers.v1beta2.Numbers/CreateNumber",
  "/fonoster.numbers.v1beta2.Numbers/UpdateNumber",
  "/fonoster.numbers.v1beta2.Numbers/GetNumber",
  "/fonoster.numbers.v1beta2.Numbers/DeleteNumber",
  "/fonoster.numbers.v1beta2.Numbers/ListNumbers",
  "/fonoster.secrets.v1beta2.Secrets/CreateSecret",
  "/fonoster.secrets.v1beta2.Secrets/UpdateSecret",
  "/fonoster.secrets.v1beta2.Secrets/GetSecret",
  "/fonoster.secrets.v1beta2.Secrets/DeleteSecret",
  "/fonoster.secrets.v1beta2.Secrets/ListSecrets"
];

const fullIdentityAccess = [
  "/fonoster.identity.v1beta2.Identity/GetUser",
  "/fonoster.identity.v1beta2.Identity/UpdateUser",
  "/fonoster.identity.v1beta2.Identity/DeleteUser",
  "/fonoster.identity.v1beta2.Identity/CreateWorkspace",
  "/fonoster.identity.v1beta2.Identity/GetWorkspace",
  "/fonoster.identity.v1beta2.Identity/UpdateWorkspace",
  "/fonoster.identity.v1beta2.Identity/ListWorkspaces",
  "/fonoster.identity.v1beta2.Identity/InviteUserToWorkspace",
  "/fonoster.identity.v1beta2.Identity/RemoveUserFromWorkspace",
  "/fonoster.identity.v1beta2.Identity/ResendWorkspaceMembershipInvitation",
  "/fonoster.identity.v1beta2.Identity/RefreshToken",
  "/fonoster.identity.v1beta2.Identity/CreateApiKey",
  "/fonoster.identity.v1beta2.Identity/DeleteApiKey",
  "/fonoster.identity.v1beta2.Identity/ListApiKeys",
  "/fonoster.identity.v1beta2.Identity/RegenerateApiKey"
];

const roles = [
  {
    name: WorkspaceRoleEnum.OWNER,
    description: "Access to all endpoints",
    access: [...fullIdentityAccess, ...workspaceAccess]
  },
  {
    name: WorkspaceRoleEnum.ADMIN,
    description: "Access to all endpoints",
    access: [...fullIdentityAccess, ...workspaceAccess]
  },
  {
    name: ApiRoleEnum.WORKSPACE_ADMIN,
    description: "Access to all endpoints",
    access: [...fullIdentityAccess, ...workspaceAccess]
  },
  {
    name: WorkspaceRoleEnum.USER,
    description: "Access to User and Workspace endpoints",
    access: [
      "/fonoster.identity.v1beta2.Identity/GetUser",
      "/fonoster.identity.v1beta2.Identity/UpdateUser",
      "/fonoster.identity.v1beta2.Identity/DeleteUser",
      "/fonoster.identity.v1beta2.Identity/CreateWorkspace",
      "/fonoster.identity.v1beta2.Identity/GetWorkspace",
      "/fonoster.identity.v1beta2.Identity/UpdateWorkspace",
      "/fonoster.identity.v1beta2.Identity/ListWorkspaces",
      "/fonoster.identity.v1beta2.Identity/RefreshToken",
      ...workspaceAccess
    ]
  }
] as Role[];

export { roles, workspaceAccess };

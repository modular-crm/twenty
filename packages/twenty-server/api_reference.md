# Twenty CRM Backend API Reference

This document provides a comprehensive reference of all API endpoints exposed by `twenty-server`.

---

## 1. API Overview

The backend exposes three main API interfaces:

| API Type | Endpoint | Description |
| :--- | :--- | :--- |
| **GraphQL Core** | `/graphql` | Main API for workspace data (objects, records, users, etc.) |
| **GraphQL Metadata** | `/metadata` | API for managing workspace schema (fields, objects, relations) |
| **REST API** | `/rest/*` | RESTful CRUD operations on dynamic object endpoints |

> [!NOTE]
> All APIs require JWT authentication. Pass the token in the `Authorization: Bearer <token>` header.

---

## 2. GraphQL API - Queries

The GraphQL API exposes **75+ Query operations**. These are read-only operations.

### Authentication & User

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `currentUser` | Returns the currently authenticated user's profile including name, email, and settings | - | [User](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4343-4372) |
| `currentWorkspace` | Returns the active workspace's configuration, billing status, and feature flags | - | [Workspace](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4636-4683) |
| `checkUserExists` | Checks if a user account exists for the given email address (used during login/signup flow) | `email: String!, captchaToken?: String` | [CheckUserExistOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#564-570) |
| `validatePasswordResetToken` | Validates a password reset token to ensure it hasn't expired before showing reset form | `token: String` | [ValidatePasswordResetTokenOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4422-4428) |

### API Keys & Webhooks

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `apiKey` | Retrieves a single API key by its ID, including name, expiration, and role | `input: GetApiKeyInput` | `ApiKey?` |
| `apiKeys` | Lists all API keys in the current workspace | - | `[ApiKey]` |
| `webhook` | Retrieves a single webhook configuration by ID | `id: UUID` | `Webhook?` |
| `webhooks` | Lists all webhooks configured in the workspace | - | `[Webhook]` |

### Billing

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `billingPortalSession` | Creates a Stripe billing portal session URL for managing subscriptions | `returnUrlPath?: String` | [BillingSessionOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#481-485) |
| `listPlans` | Returns all available subscription plans with pricing information | - | `[BillingPlanOutput]` |
| `getMeteredProductsUsage` | Returns usage data for metered billing products (e.g., workflow executions) | - | `[BillingMeteredProductUsageOutput]` |

### Objects & Metadata

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `object` | Retrieves metadata for a single object type (e.g., Company, Person) by ID | `id: UUID` | [Object](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2813-2842) |
| `objects` | Lists all object types in the workspace schema with pagination | `paging, filter, sorting` | [ObjectConnection](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2855-2862) |
| `field` | Retrieves metadata for a single field by ID | `id: UUID` | [Field](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1285-1310) |
| `fields` | Lists all fields across all objects with pagination and filtering | `paging, filter, sorting` | [FieldConnection](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1311-1318) |
| `index` | Retrieves a database index definition by ID | `id: UUID` | [Index](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1543-1557) |
| `indexMetadatas` | Lists all database indexes in the workspace | `paging, filter, sorting` | [IndexConnection](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1570-1577) |

### Views

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `getCoreView` | Retrieves a saved view configuration (table/kanban/calendar settings) by ID | `id: String` | `CoreView?` |
| `getCoreViews` | Lists all saved views, optionally filtered by object type | `objectMetadataId?: String` | `[CoreView]` |
| `getCoreViewFields` | Returns the field visibility and ordering configuration for a view | `viewId: String` | `[CoreViewField]` |
| `getCoreViewFilters` | Returns all filter conditions applied to a view | `viewId?: String` | `[CoreViewFilter]` |
| `getCoreViewFilterGroups` | Returns filter groups (AND/OR logic groupings) for complex filters | `viewId?: String` | `[CoreViewFilterGroup]` |
| `getCoreViewGroups` | Returns grouping configuration for kanban columns or table groups | `viewId?: String` | `[CoreViewGroup]` |
| `getCoreViewSorts` | Returns sorting configuration for a view | `viewId?: String` | `[CoreViewSort]` |

### Page Layouts

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `getPageLayout` | Retrieves a record detail page layout configuration | `id: String` | `PageLayout?` |
| `getPageLayouts` | Lists all page layouts, optionally filtered by object type | `objectMetadataId?: String` | `[PageLayout]` |
| `getPageLayoutTabs` | Returns tabs configured within a page layout | `pageLayoutId: String` | `[PageLayoutTab]` |
| `getPageLayoutWidgets` | Returns widgets (fields, related lists, etc.) within a tab | `pageLayoutTabId: String` | `[PageLayoutWidget]` |

### Applications & Agents (AI)

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `findManyAgents` | Lists all AI agents configured in the workspace | - | `[Agent]` |
| `findOneAgent` | Retrieves a single AI agent configuration including prompt and model settings | `input: AgentIdInput` | [Agent](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#51-70) |
| `findManyApplications` | Lists all installed applications (packages of agents, functions, objects) | - | `[Application]` |
| `findOneApplication` | Retrieves details of a single application | `id: UUID` | [Application](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#233-246) |

### Serverless Functions & Triggers

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `findManyServerlessFunctions` | Lists all serverless functions (custom code) in the workspace | - | `[ServerlessFunction]` |
| `findOneServerlessFunction` | Retrieves a serverless function's metadata and configuration | `input: ServerlessFunctionIdInput` | [ServerlessFunction](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3728-3745) |
| `getServerlessFunctionSourceCode` | Returns the source code of a serverless function | `input: ServerlessFunctionIdInput, version?: String` | `JSON?` |
| `getAvailablePackages` | Lists npm packages available for use in serverless functions | `input: ServerlessFunctionIdInput` | `JSON` |
| `findManyCronTriggers` | Lists all scheduled (cron) triggers that execute workflows on a schedule | - | `[CronTrigger]` |
| `findManyDatabaseEventTriggers` | Lists triggers that fire on database events (create/update/delete) | - | `[DatabaseEventTrigger]` |
| `findManyRouteTriggers` | Lists HTTP route triggers that expose workflows as API endpoints | - | `[RouteTrigger]` |

### Roles & Permissions

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `getRoles` | Lists all roles defined in the workspace with their permission sets | - | `[Role]` |

### SSO & Domains

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `getSSOIdentityProviders` | Lists configured SSO identity providers (OIDC/SAML) | - | `[FindAvailableSSOIDPOutput]` |
| `getApprovedAccessDomains` | Lists email domains approved for automatic workspace access | - | `[ApprovedAccessDomain]` |
| `findManyPublicDomains` | Lists custom public domains configured for the workspace | - | `[PublicDomain]` |
| `getEmailingDomains` | Lists verified domains for sending transactional emails | - | `[EmailingDomain]` |

### Timeline & Activities

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `getTimelineThreadsFromCompanyId` | Fetches email threads associated with a company for the activity timeline | `companyId: UUID, page: Int, pageSize: Int` | [TimelineThreadsWithTotal](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3970-3975) |
| `getTimelineThreadsFromPersonId` | Fetches email threads associated with a person for the activity timeline | `personId: UUID, page: Int, pageSize: Int` | [TimelineThreadsWithTotal](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3970-3975) |
| `getTimelineCalendarEventsFromCompanyId` | Fetches calendar events associated with a company | `companyId: UUID, page: Int, pageSize: Int` | [TimelineCalendarEventsWithTotal](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3939-3944) |
| `getTimelineCalendarEventsFromPersonId` | Fetches calendar events associated with a person | `personId: UUID, page: Int, pageSize: Int` | [TimelineCalendarEventsWithTotal](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3939-3944) |

### Other Queries

| Query | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `search` | Performs a global full-text search across all objects in the workspace | `searchInput: SearchInput` | [SearchResultConnection](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3695-3700) |
| `versionInfo` | Returns the server version and build information | - | [VersionInfo](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4448-4453) |
| `getSystemHealthStatus` | Returns overall system health status including all services | - | [SystemHealth](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3871-3875) |
| `getIndicatorHealthStatus` | Returns health status for a specific service (database, redis, etc.) | `indicatorId: HealthIndicatorId` | [AdminPanelHealthServiceData](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#28-38) |
| `getConfigVariablesGrouped` | Returns all server configuration variables grouped by category | - | [ConfigVariablesOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#646-650) |
| `getPostgresCredentials` | Returns read-only Postgres proxy credentials for direct DB access | - | `PostgresCredentials?` |

---

## 3. GraphQL API - Mutations

The GraphQL API exposes **180+ Mutation operations**. These are write operations.

### Authentication

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `signIn` | Authenticates a user and returns available workspaces and tokens | `email: String!, password?: String, captchaToken?: String` | [AvailableWorkspacesAndAccessTokensOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#326-331) |
| `signUp` | Creates a new user account (email verification may be required) | `email: String!, password?: String, captchaToken?: String` | [AvailableWorkspacesAndAccessTokensOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#326-331) |
| `signUpInWorkspace` | Accepts an invitation and creates a user account in an existing workspace | `input: SignUpInWorkspaceInput` | [SignUpOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3805-3810) |
| `signUpInNewWorkspace` | Creates a new workspace and user account simultaneously | `input: SignUpInNewWorkspaceInput` | [SignUpOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3805-3810) |
| `renewToken` | Exchanges a refresh token for new access and refresh tokens | - | [AuthTokens](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#292-296) |
| `getLoginTokenFromCredentials` | Validates credentials and returns a short-lived login token | `email: String!, password: String!, captchaToken?: String` | [LoginTokenOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1715-1719) |
| `getAuthTokensFromLoginToken` | Exchanges a login token for full access tokens | `loginToken: String!` | [AuthTokens](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#292-296) |
| `generateTransientToken` | Creates a short-lived token for specific operations (e.g., file uploads) | - | [TransientTokenOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3976-3980) |
| `emailPasswordResetLink` | Sends a password reset email to the specified address | `email: String!` | [EmailPasswordResetLinkOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1215-1220) |
| `updatePasswordViaResetToken` | Sets a new password using a valid reset token | `token: String!, newPassword: String!` | [InvalidatePasswordOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1644-1649) |

### Workspace Management

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `activateWorkspace` | Completes workspace setup after creation (sets display name, etc.) | `data: ActivateWorkspaceInput` | [Workspace](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4636-4683) |
| `updateWorkspace` | Updates workspace settings (name, logo, subdomain, etc.) | `data: UpdateWorkspaceInput` | [Workspace](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4636-4683) |
| `deleteCurrentWorkspace` | Permanently deletes the current workspace and all its data | - | [Workspace](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4636-4683) |
| `sendInvitations` | Sends email invitations to join the workspace | `emails: [String!]!` | [SendInvitationsOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3713-3720) |
| `deleteWorkspaceInvitation` | Revokes a pending workspace invitation | `id: UUID` | `String` |

### API Keys

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createApiKey` | Creates a new API key with specified name, expiration, and role | `input: CreateApiKeyInput` | [ApiKey](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#190-202) |
| `updateApiKey` | Updates an API key's name or role | `input: UpdateApiKeyInput` | `ApiKey?` |
| `revokeApiKey` | Immediately invalidates an API key | `id: UUID` | `ApiKey?` |
| `generateApiKeyToken` | Generates the actual token value for an API key (only shown once) | `id: UUID, expiresAt: DateTime` | [ApiKeyToken](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#211-215) |

### Views (CRUD)

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createCoreView` | Creates a new saved view (table, kanban, calendar, etc.) | `input: CreateViewInput` | [CoreView](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#677-707) |
| `updateCoreView` | Updates view properties (name, icon, type, etc.) | `input: UpdateViewInput` | [CoreView](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#677-707) |
| `deleteCoreView` | Soft-deletes a view (can be restored) | `id: String` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |
| `createCoreViewField` | Adds a field column to a view with visibility and position | `input: CreateViewFieldInput` | [CoreViewField](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#708-722) |
| `createManyCoreViewFields` | Bulk creates multiple field columns at once | `input: [CreateViewFieldInput!]!` | `[CoreViewField]` |
| `updateCoreViewField` | Updates field column visibility, width, or position | `input: UpdateViewFieldInput` | [CoreViewField](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#708-722) |
| `deleteCoreViewField` | Removes a field column from a view | `id: String` | [CoreViewField](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#708-722) |
| `createCoreViewFilter` | Adds a filter condition to a view | `input: CreateViewFilterInput` | [CoreViewFilter](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#723-738) |
| `updateCoreViewFilter` | Modifies an existing filter condition | `input: UpdateViewFilterInput` | [CoreViewFilter](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#723-738) |
| `deleteCoreViewFilter` | Removes a filter from a view | `id: String` | [CoreViewFilter](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#723-738) |
| `createCoreViewSort` | Adds a sort order to a view | `input: CreateViewSortInput` | [CoreViewSort](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#766-777) |
| `updateCoreViewSort` | Changes sort direction or field | `input: UpdateViewSortInput` | [CoreViewSort](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#766-777) |
| `deleteCoreViewSort` | Removes sorting from a view | `id: String` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |
| `createCoreViewGroup` | Creates a kanban column or table grouping | `input: CreateViewGroupInput` | [CoreViewGroup](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#752-765) |
| `createManyCoreViewGroups` | Bulk creates multiple groupings | `input: [CreateViewGroupInput!]!` | `[CoreViewGroup]` |
| `updateCoreViewGroup` | Updates group visibility or position | `input: UpdateViewGroupInput` | [CoreViewGroup](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#752-765) |
| `deleteCoreViewGroup` | Removes a grouping from a view | `id: String` | [CoreViewGroup](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#752-765) |

### Schema Management (Objects & Fields)

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createOneObject` | Creates a new custom object type in the workspace schema | `input: CreateObjectInput` | [Object](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2813-2842) |
| `updateOneObject` | Updates object metadata (label, icon, plural name, etc.) | `input: UpdateObjectInput` | [Object](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2813-2842) |
| `deleteOneObject` | Deletes a custom object type and all its records | `id: UUID` | [Object](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2813-2842) |
| `createOneField` | Adds a new field to an object (text, number, relation, etc.) | `input: CreateFieldInput` | [Field](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1285-1310) |
| `updateOneField` | Updates field properties (label, required, default value, etc.) | `input: UpdateFieldInput` | [Field](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1285-1310) |
| `deleteOneField` | Removes a field from an object | `id: UUID` | [Field](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1285-1310) |

### Agents (AI)

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createOneAgent` | Creates a new AI agent with prompt, model, and configuration | `input: CreateAgentInput` | [Agent](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#51-70) |
| `updateOneAgent` | Updates an agent's prompt, model, or other settings | `input: UpdateAgentInput` | [Agent](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#51-70) |
| `deleteOneAgent` | Permanently deletes an AI agent | `input: AgentIdInput` | [Agent](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#51-70) |
| `assignRoleToAgent` | Assigns a permission role to an agent for access control | `agentId: UUID, roleId: UUID` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |
| `removeRoleFromAgent` | Removes role assignment from an agent | `agentId: UUID` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |

### Serverless Functions

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createOneServerlessFunction` | Creates a new serverless function with initial code | `input: CreateServerlessFunctionInput` | [ServerlessFunction](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3728-3745) |
| `updateOneServerlessFunction` | Updates function code or configuration | `input: UpdateServerlessFunctionInput` | [ServerlessFunction](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3728-3745) |
| `publishServerlessFunction` | Publishes a draft function version to production | `input: PublishServerlessFunctionInput` | [ServerlessFunction](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3728-3745) |
| `deleteOneServerlessFunction` | Deletes a serverless function | `input: ServerlessFunctionIdInput` | [ServerlessFunction](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3728-3745) |
| `executeOneServerlessFunction` | Manually executes a function with test input | `input: ExecuteServerlessFunctionInput` | [ServerlessFunctionExecutionResult](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3746-3759) |

### Triggers

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createOneCronTrigger` | Creates a scheduled trigger using cron expression | `input: CreateCronTriggerInput` | [CronTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1018-1025) |
| `updateOneCronTrigger` | Updates cron schedule or associated workflow | `input: UpdateCronTriggerInput` | [CronTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1018-1025) |
| `deleteOneCronTrigger` | Deletes a scheduled trigger | `input: CronTriggerIdInput` | [CronTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1018-1025) |
| `createOneDatabaseEventTrigger` | Creates a trigger that fires on record changes | `input: CreateDatabaseEventTriggerInput` | [DatabaseEventTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1051-1058) |
| `updateOneDatabaseEventTrigger` | Updates event type or object filter | `input: UpdateDatabaseEventTriggerInput` | [DatabaseEventTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1051-1058) |
| `deleteOneDatabaseEventTrigger` | Deletes a database event trigger | `input: DatabaseEventTriggerIdInput` | [DatabaseEventTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1051-1058) |
| `createOneRouteTrigger` | Creates an HTTP webhook endpoint trigger | `input: CreateRouteTriggerInput` | [RouteTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3633-3642) |
| `updateOneRouteTrigger` | Updates route path or authentication | `input: UpdateRouteTriggerInput` | [RouteTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3633-3642) |
| `deleteOneRouteTrigger` | Deletes an HTTP route trigger | `input: RouteTriggerIdInput` | [RouteTrigger](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3633-3642) |

### Workflows

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| [activateWorkflowVersion](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2137-2140) | Enables a workflow version to process triggers | `workflowVersionId: UUID` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |
| `deactivateWorkflowVersion` | Disables a workflow version (stops processing) | `workflowVersionId: UUID` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |
| `createDraftFromWorkflowVersion` | Creates an editable draft copy of a published workflow | `workflowId: UUID` | [WorkflowVersionDto](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4618-4629) |
| `duplicateWorkflow` | Creates a complete copy of a workflow with new ID | `workflowId: UUID` | [WorkflowVersionDto](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4618-4629) |
| `runWorkflowVersion` | Manually triggers a workflow execution with input data | `input: RunWorkflowVersionInput` | [RunWorkflowVersionOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3656-3660) |
| `stopWorkflowRun` | Cancels a running workflow execution | `workflowRunId: UUID` | [WorkflowRun](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4583-4588) |
| `createWorkflowVersionStep` | Adds a new action step to a workflow | `input: CreateWorkflowVersionStepInput` | [WorkflowVersionStepChanges](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4630-4635) |
| `updateWorkflowVersionStep` | Modifies an existing workflow step's configuration | `input: UpdateWorkflowVersionStepInput` | [WorkflowAction](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4555-4565) |
| `deleteWorkflowVersionStep` | Removes a step from a workflow | `input: DeleteWorkflowVersionStepInput` | [WorkflowVersionStepChanges](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4630-4635) |
| `duplicateWorkflowVersionStep` | Creates a copy of an existing step in the workflow | `input: DuplicateWorkflowVersionStepInput` | [WorkflowVersionStepChanges](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4630-4635) |

### Webhooks

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createWebhook` | Creates a webhook to send events to an external URL | `input: CreateWebhookInput` | [Webhook](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#4510-4523) |
| `updateWebhook` | Updates webhook URL, events, or authentication | `input: UpdateWebhookInput` | `Webhook?` |
| `deleteWebhook` | Removes a webhook | `id: UUID` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |

### Roles & Permissions

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createOneRole` | Creates a new permission role with specified access levels | `input: CreateRoleInput` | [Role](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3608-3632) |
| `updateOneRole` | Updates role name or permissions | `input: UpdateRoleInput` | [Role](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3608-3632) |
| `deleteOneRole` | Deletes a role (fails if users are assigned) | `id: UUID` | `String` |
| `assignRoleToApiKey` | Associates a permission role with an API key | `apiKeyId: UUID, roleId: UUID` | [Boolean](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#538-542) |
| `upsertObjectPermissions` | Creates or updates object-level permissions (CRUD) for a role | `input: [UpsertObjectPermissionInput!]!` | `[ObjectPermission]` |
| `upsertFieldPermissions` | Creates or updates field-level permissions (read/edit) for a role | `input: [UpsertFieldPermissionInput!]!` | `[FieldPermission]` |
| `upsertPermissionFlags` | Creates or updates feature flags for a role | `input: [UpsertPermissionFlagInput!]!` | `[PermissionFlag]` |

### SSO

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `createOIDCIdentityProvider` | Configures an OpenID Connect SSO provider (Google, Okta, etc.) | `input: SetupOidcSsoInput` | [SetupSsoOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3796-3804) |
| `createSAMLIdentityProvider` | Configures a SAML 2.0 SSO provider (Azure AD, etc.) | `input: SetupSamlSsoInput` | [SetupSsoOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3796-3804) |
| `editSSOIdentityProvider` | Updates SSO provider configuration | `input: EditSsoInput` | [EditSsoOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1200-1208) |
| `deleteSSOIdentityProvider` | Removes an SSO provider | `input: DeleteSsoInput` | [DeleteSsoOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1098-1102) |

### File Uploads

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `uploadFile` | Uploads a file attachment and returns a signed URL | `file: Upload!, fileFolder?: FileFolder` | [SignedFile](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3811-3816) |
| `uploadImage` | Uploads an image with automatic optimization and returns signed URL | `file: Upload!, fileFolder?: FileFolder` | [SignedFile](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3811-3816) |
| `uploadProfilePicture` | Uploads a user's profile avatar image | `file: Upload!` | [SignedFile](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3811-3816) |
| `uploadWorkspaceLogo` | Uploads the workspace's logo image | `file: Upload!` | [SignedFile](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3811-3816) |
| `createFile` | Creates a file record (used after external upload) | `input: CreateFileInput` | [File](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1383-1392) |
| `deleteFile` | Deletes a file attachment | `id: UUID` | [File](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1383-1392) |

### Billing

| Mutation | Description | Arguments | Returns |
| :--- | :--- | :--- | :--- |
| `checkoutSession` | Creates a Stripe checkout session for new subscriptions | `plan?: BillingPlanKey, recurringInterval: SubscriptionInterval, ...` | [BillingSessionOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#481-485) |
| `switchBillingPlan` | Upgrades or downgrades the subscription plan | `newPlan: BillingPlanKey` | [BillingUpdateOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#525-532) |
| `switchSubscriptionInterval` | Changes between monthly and annual billing | `newInterval: SubscriptionInterval` | [BillingUpdateOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#525-532) |
| `endSubscriptionTrialPeriod` | Ends trial early and starts paid subscription | - | [BillingEndTrialPeriodOutput](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#381-388) |

---

## 4. REST API

The REST API provides a **generic CRUD interface** for all objects in the workspace.

### Base URL Pattern
```
/rest/{objectNamePlural}
/rest/{objectNamePlural}/{recordId}
```

### Core Endpoints

| Method | Path Pattern | Description |
| :--- | :--- | :--- |
| `GET` | `/rest/{objects}` | Retrieves a paginated list of records with optional filtering, sorting, and field selection |
| `GET` | `/rest/{objects}/{id}` | Retrieves a single record by its unique ID with related records |
| `GET` | `/rest/{objects}/groupBy` | Groups records by a specified field and returns counts/aggregates |
| `POST` | `/rest/{objects}` | Creates a new record with the provided field values |
| `POST` | `/rest/batch/{objects}` | Creates multiple records in a single request (bulk insert) |
| `POST` | `/rest/{objects}/duplicates` | Searches for potential duplicate records based on matching rules |
| `PATCH` | `/rest/{objects}/{id}` | Updates specific fields of an existing record |
| `PATCH` | `/rest/{objects}/{id}/merge` | Merges multiple records into one, combining their related data |
| `PATCH` | `/rest/restore/{objects}/{id}` | Restores a previously soft-deleted record |
| `DELETE` | `/rest/{objects}/{id}` | Soft-deletes a record (can be restored later) |
| `PUT` | `/rest/{objects}/{id}` | Updates a record (alias for PATCH, kept for backward compatibility) |

### Query Parameters (GET requests)

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `filter` | JSON | Filters records by field values. Supports operators: [eq](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3883-3893), `neq`, `like`, `ilike`, `gt`, `gte`, [lt](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3988-3998), [lte](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#3988-3998), [in](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#374-380), [nin](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2556-2559) |
| `orderBy` | String | Sorts results. Format: `fieldName[AscNullsFirst\|DescNullsLast]` |
| `limit` | Number | Maximum records to return (default: 50, max: 100) |
| `after` | String | Cursor-based pagination: start after this cursor |
| `before` | String | Cursor-based pagination: start before this cursor |
| `depth` | Number | How many levels of relationships to include (default: 1) |

### Example Requests

**List Companies (filtered and sorted)**
```bash
GET /rest/companies?filter[name][ilike]=acme&orderBy=createdAt[DescNullsLast]&limit=20
Authorization: Bearer <token>
```

**Create a Person**
```bash
POST /rest/people
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

**Update a Company**
```bash
PATCH /rest/companies/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
Content-Type: application/json

{
  "annualRevenue": 5000000
}
```

---

## 5. Key Types Reference

### Scalars

| Scalar | TypeScript Type | Description |
| :--- | :--- | :--- |
| `UUID` | `string` | Universally unique identifier (v4) |
| [DateTime](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#1063-1073) | `string` | ISO 8601 formatted date-time string |
| `JSON` | [any](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#5054-5055) | Arbitrary JSON data |
| `JSONObject` | `Record<string, any>` | JSON object (not array) |
| [Upload](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts#2731-2735) | n/a | GraphQL file upload |
| `ConnectionCursor` | `string` | Opaque cursor for pagination |

### Common Enums

| Enum | Values | Description |
| :--- | :--- | :--- |
| `AggregateOperations` | `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `COUNT_EMPTY`, `COUNT_NOT_EMPTY` | Aggregation functions for analytics |
| `ViewType` | `TABLE`, `KANBAN`, `CALENDAR`, `TIMELINE` | Types of data views |
| `ViewFilterOperand` | `EQUALS`, `NOT_EQUALS`, `CONTAINS`, `STARTS_WITH`, `ENDS_WITH`, `GREATER_THAN`, `LESS_THAN`, `IS_EMPTY`, `IS_NOT_EMPTY` | Filter comparison operators |
| `BillingPlanKey` | `PRO`, `ENTERPRISE` | Subscription plan tiers |
| `SubscriptionStatus` | `ACTIVE`, `PAST_DUE`, `CANCELED`, `TRIALING`, `UNPAID` | Current subscription state |

---

## 6. Additional Resources

- **GraphQL Playground**: Access at `<server_url>/graphql` to explore the schema interactively
- **OpenAPI Spec**: REST API documentation at `<server_url>/api-docs`
- **Source Schema**: Full generated types in [graphql.ts](file:///home/kartik-chainscore/Chainscore/CRM/modular-frontend/packages/twenty-front/src/generated/graphql.ts) (6761 lines, 922 types)

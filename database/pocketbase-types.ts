/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Repositories = "repositories",
	RepositoryAttributes = "repository_attributes",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type RepositoriesRecord = {
	title: string
	user: RecordIdString[]
}

export type RepositoryAttributesRecord = {
	attribute_type: string
	payload: string
	repository: RecordIdString[]
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type RepositoriesResponse<Texpand = unknown> = RepositoriesRecord & BaseSystemFields<Texpand>
export type RepositoryAttributesResponse<Texpand = unknown> = RepositoryAttributesRecord & BaseSystemFields<Texpand>
export type UsersResponse = UsersRecord & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	repositories: RepositoriesRecord
	repository_attributes: RepositoryAttributesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	repositories: RepositoriesResponse
	repository_attributes: RepositoryAttributesResponse
	users: UsersResponse
}
import PocketBase from 'pocketbase'
;(async () => {
  const pb = new PocketBase('http://127.0.0.1:8090')

  await pb.admins.authWithPassword('initial@admin.io', 'change__me')

  // create base collection
  const repositories = await pb.collections.create({
    name: 'repositories',
    type: 'base',
    schema: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'user',
        type: 'relation',
        options: { collectionId: (await pb.collections.getOne('users'))?.id },
        required: true,
      },
    ],
  })

  const repository_attributes = await pb.collections.create({
    name: 'repository_attributes',
    type: 'base',
    schema: [
      {
        name: 'attribute_type',
        type: 'text',
        required: true,
      },
      {
        name: 'payload',
        type: 'text',
        required: true,
      },
      {
        name: 'repository',
        type: 'relation',
        options: { collectionId: (await pb.collections.getOne('repositories'))?.id },
        required: true,
      },
    ],
  })
})()

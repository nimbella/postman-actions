import { join, resolve } from 'path'
import { default as Generate } from '@nimbella/postman-api/lib/invoker'
import { Flags, deployProject, doLogin, fileSystemPersister } from 'nimbella-deployer'
const { readdir } = require('fs').promises;

async function main(args: any) {
  try {
    await nimGenerate(args.collection, args.pm_api_key)
    await nimProjectDeploy(args.collection, args.nim_auth_token)

      ; (async () => {
        for await (const f of getFiles(join(process.cwd(), args.collection))) {
          console.log(f);
        }
      })()

  } catch (error) {
    console.error(error)
    return error
  }
}

async function nimGenerate(collection: string, pm_api_key: string) {
  const generator = new Generate({
    id: collection,
    key: pm_api_key,
    language: 'ts',
    overwrite: true,
    deploy: false,
    deployForce: false,
    updateSource: false,
    clientCode: false,
    update: false,
    init: false,
  })
  return await generator.generate()
    .catch((error) => {
      console.log('Oops! Some Error Occurred, Please Try Again')
      console.error(error)
    })
}

async function nimProjectDeploy(collection: string, nim_auth_token: string) {
  const projPath = join(process.cwd(), collection)
  const flags: Flags = {
    verboseBuild: false,
    verboseZip: false,
    production: false,
    incremental: false,
    yarn: false,
    env: undefined,
    webLocal: undefined,
    include: undefined,
    exclude: undefined,
    remoteBuild: false
  }
  const cred = await doLogin(nim_auth_token, fileSystemPersister)
  return await deployProject(projPath, cred.ow, cred, fileSystemPersister, flags)
}

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

module.exports = { main }

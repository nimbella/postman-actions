import { join } from "path";
import { default as Generate } from "@nimbella/postman-api/lib/invoker";
import {
  Flags,
  deployProject,
  doLogin,
  fileSystemPersister,
} from "nimbella-deployer";

async function main(args: any) {
  try {
    if (args.collection && args.pm_api_key && args.nim_auth_token) {
      console.log('-----------------collection name-----------------');
      console.log(args.collection );    
      console.log('-----------------generating-----------------');
      await nimGenerate(args.collection, args.pm_api_key);
      console.log('-----------------generated-----------------');
      await nimProjectDeploy(args.collection, args.nim_auth_token);
      console.log('-----------------deployed-----------------');
      return {
        body: `${args.collection} Deployed!`,
      };
    } else {
      return {
        body: `Missing required parameters`,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      body: error.message,
    };
  }
}

async function nimGenerate(collection: string, pm_api_key: string) {
  const generator = new Generate({
    id: collection,
    key: pm_api_key,
    language: "ts",
    overwrite: true,
    deploy: false,
    deployForce: false,
    updateSource: false,
    clientCode: false,
    update: false,
    init: false,
  });
  return generator.generate().catch((error) => {
    throw new Error(error.message);
  });
}

async function nimProjectDeploy(collection: string, nim_auth_token: string) {
  const projPath = join(process.cwd(), collection);
  const flags: Flags = {
    verboseBuild: true,
    verboseZip: false,
    production: false,
    incremental: false,
    yarn: false,
    env: undefined,
    webLocal: undefined,
    include: undefined,
    exclude: undefined,
    remoteBuild: false,
  };
  const cred = await doLogin(nim_auth_token, fileSystemPersister).catch(
    (error) => {
      throw new Error(error.message);
    }
  );
  console.log(`___________cred___________`);
  console.log(cred);
  console.log(`___________projPath___________`);
  console.log(projPath);
  return deployProject(
    projPath,
    cred.ow,
    cred,
    fileSystemPersister,
    flags
  ).catch((error) => {
    throw new Error(error.message);
  });
}

module.exports = { main };

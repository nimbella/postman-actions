import { join } from "path";
import { existsSync } from "fs";
import { default as Generate } from "@nimbella/postman-api/lib/invoker";
import { sanitizeName } from "@nimbella/postman-api/lib/utils";
import {
  Flags,
  deployProject,
  doLogin,
  fileSystemPersister,
  initializeAPI,
  Credentials,
} from "nimbella-deployer";

async function main(args: any) {
  try {
    const pm_api_key = args.__ow_headers["pm-api-key"];
    const nim_auth_token = args.__ow_headers["nim-auth-token"];

    if (args.collection && pm_api_key && nim_auth_token) {
      initializeAPI("Postman-action-deploy/1.0.0");

      const cred: Credentials = await doLogin(
        nim_auth_token,
        fileSystemPersister
      ).catch((error) => {
        throw new Error(error.message);
      });

      await nimProjectGenerate(args.collection, pm_api_key, cred.namespace);
      await nimProjectDeploy(args.collection, cred);
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

async function nimProjectGenerate(
  collection: string,
  pm_api_key: string,
  targetNamespace: string
) {
  const generator = new Generate({
    id: collection,
    key: pm_api_key,
    language: "js",
    overwrite: true,
    deploy: false,
    deployForce: false,
    updateSource: true,
    clientCode: false,
    update: false,
    init: false,
    targetNamespace,
  });

  return generator.generate().catch((error) => {
    throw new Error(error.message);
  });
}

async function nimProjectDeploy(collection: string, cred: Credentials) {
  const projPath = join(process.cwd(), sanitizeName(collection, "-"));
  console.log(projPath);

  if (!existsSync(projPath)) {
    throw new Error(`Couldn't find project for ${collection}`);
  }

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

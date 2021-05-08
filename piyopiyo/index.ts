import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import passport from "passport";
import * as pad from "passport-azure-ad";

const settings = {
  issuerDomain: "hogehogecampaign.b2clogin.com",
  b2cDomain: "hogehogecampaign.onmicrosoft.com",
  clientId: "e3870b94-11e9-4d78-bdc3-9e822dc10a84",
  tenantId: "14c34ae7-a677-4c96-8475-5398ce5ef230",
  flowName: "B2C_1_SIGNUP_SIGNIN",
  apiScopeName: "piyopiyo",
};

const options: pad.IBearerStrategyOption = {
  identityMetadata: `https://${settings.issuerDomain}/${settings.b2cDomain}/v2.0/.well-known/openid-configuration`,
  issuer: `https://${settings.issuerDomain}/${settings.tenantId}/v2.0/`,
  clientID: settings.clientId,
  audience: settings.clientId,
  validateIssuer: true,
  loggingLevel: "info",
  scope: ["openid", "profile", settings.apiScopeName],
  isB2C: true,
  policyName: settings.flowName,
  loggingNoPII: false,
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const bearerStrategy = new pad.BearerStrategy(options, (token, done) => {
      done(null, "verified", token);
    });
    passport.initialize();
    passport.use(bearerStrategy);

    const x = passport.authenticate(
      "oauth-bearer",
      { session: false },
      (req, res, info) => {
        if (res === "verified") {
          context.res = {
            body: "verified piyopiyo",
          };
          resolve();
        } else {
          reject(info);
        }
      }
    );
    x(context.req, context.req);
  });
};

export default httpTrigger;

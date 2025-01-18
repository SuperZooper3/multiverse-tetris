import { applyParams, save, ActionOptions } from "gadget-server";

// Powers form in web/routes/sign-in.jsx

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, session }) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();
  await save(record);
  // Assigns the signed-in user to the active session
  session?.set("user", { _link: record.id });
};

/** @type { ActionOnSuccess } */
export const onSuccess = async ({ params, record, logger, api, session }) => {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: {
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};

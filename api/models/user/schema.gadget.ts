import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://tetris.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "hx5F_s-DwqAz",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "ObuslTyqcviC",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "EaZtQpjcL-gf",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "cuysEt0owApJ",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "OwTQBj1B-RxP",
    },
    firstName: { type: "string", storageKey: "6PmRXNAOQHRF" },
    googleImageUrl: { type: "url", storageKey: "q3p-T6vCePvl" },
    googleProfileId: { type: "string", storageKey: "JK3-yA5Q04yS" },
    lastName: { type: "string", storageKey: "GiZ-0MefNHHN" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "gMNO85Gzo81q",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "flRjs77mE_6d",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "q26TdL-ecpF1",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "eb8mxDt80FVj",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "nBJut7QuBvYq",
    },
  },
};

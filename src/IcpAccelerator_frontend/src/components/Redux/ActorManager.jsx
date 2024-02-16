

import { createActor } from "../../../../declarations/IcpAccelerator_backend";

export const initActor = async (identity) => {
 const canisterId =
    process.env.CANISTER_ID_ICPACCELERATOR_BACKEND ||
    process.env.ICPACCELERATOR_BACKEND_CANISTER_ID;
  console.log('canister id + identity =>' , canisterId , identity )
  return createActor(canisterId, { agentOptions: { identity } });
  
};



set -e

dfx canister stop IcpAccelerator_frontend --network ic
dfx canister stop admin_frontend --network ic
dfx canister stop IcpAccelerator_backend --network ic

dfx canister delete IcpAccelerator_frontend --network ic
dfx canister delete admin_frontend --network ic
dfx canister delete IcpAccelerator_backend --network ic
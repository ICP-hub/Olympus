cargo build --release --target wasm32-unknown-unknown --package IcpAccelerator_backend

candid-extractor target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm >src/IcpAccelerator_backend/IcpAccelerator_backend.did

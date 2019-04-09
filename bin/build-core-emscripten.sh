#!/bin/sh

#EMCC_DEBUG=1

mkdir -p build &&
cd build &&
emconfigure cmake  .. &&
emmake cmake --build . &&
emmake make . &&
cd - &&
cp build/RyoCoreCpp.js src/ &&
cp build/RyoCoreCpp.wasm dist/ &&
npm run-script build

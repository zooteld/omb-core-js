#!/bin/sh

bin/build-emcpp.sh &&
cp build/RyoCoreCpp.js dist/ &&
cp build/RyoCoreCpp.wasm dist/

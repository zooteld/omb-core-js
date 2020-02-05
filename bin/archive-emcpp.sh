#!/bin/sh

bin/build-emcpp.sh &&
cp build/ombCoreCpp.js omb_utils/ &&
cp build/ombCoreCpp.wasm omb_utils/

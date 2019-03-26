#!/bin/sh

bin/build-emcpp.sh &&
cp build/RyoCoreCpp.js ryo_utils/ &&
cp build/RyoCoreCpp.wasm ryo_utils/

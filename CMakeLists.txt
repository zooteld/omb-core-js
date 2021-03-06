
cmake_minimum_required(VERSION 3.4.1)

SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

project(ombCoreCpp)
#
include_directories("build/boost/include") # must exist already - run bin/build-boost-emscripten.sh
#
include_directories("src")
#
set(omb_CORE_CPP "src/submodules/omb-core-cpp")
set(omb_CORE_CPP_SRC "${omb_CORE_CPP}/src")
include_directories("${omb_CORE_CPP}/src")
#
set(omb_SRC "${omb_CORE_CPP}/contrib/omb-core-custom")
include_directories(${omb_SRC})
include_directories("${omb_SRC}/epee/include")
include_directories("${omb_SRC}/common")
include_directories("${omb_SRC}/vtlogger")
include_directories("${omb_SRC}/crypto")
include_directories("${omb_SRC}/cryptonote_basic")
include_directories("${omb_SRC}/multisig")
include_directories("${omb_SRC}/cryptonote_core")
include_directories("${omb_SRC}/cryptonote_protocol")
include_directories("${omb_SRC}/wallet")
include_directories("${omb_SRC}/rpc")
include_directories("${omb_SRC}/mnemonics")
include_directories("${omb_SRC}/contrib/libsodium/include") # support sodium/… paths
include_directories("${omb_SRC}/contrib/libsodium/include/sodium")
#
# keeping test files in a separate source directory
# file(GLOB TEST_SRCS RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} test/test_*.cpp)
#
set(
    SRC_FILES
    #
    src/index.cpp
    #
    ${omb_CORE_CPP_SRC}/omb_address_utils.hpp
    ${omb_CORE_CPP_SRC}/omb_address_utils.cpp
    ${omb_CORE_CPP_SRC}/omb_paymentID_utils.hpp
    ${omb_CORE_CPP_SRC}/omb_paymentID_utils.cpp
    ${omb_CORE_CPP_SRC}/omb_key_image_utils.hpp
    ${omb_CORE_CPP_SRC}/omb_key_image_utils.cpp
    ${omb_CORE_CPP_SRC}/omb_transfer_utils.hpp
    ${omb_CORE_CPP_SRC}/omb_transfer_utils.cpp
    ${omb_CORE_CPP_SRC}/omb_fork_rules.hpp
    ${omb_CORE_CPP_SRC}/omb_fork_rules.cpp
    ${omb_CORE_CPP_SRC}/omb_wallet_utils.hpp
    ${omb_CORE_CPP_SRC}/omb_wallet_utils.cpp
    ${omb_CORE_CPP_SRC}/omb_mining_utils.hpp
    ${omb_CORE_CPP_SRC}/omb_mining_utils.cpp
    ${omb_CORE_CPP_SRC}/serial_bridge_index.hpp
    ${omb_CORE_CPP_SRC}/serial_bridge_index.cpp
    ${omb_CORE_CPP_SRC}/tools__ret_vals.hpp
    ${omb_CORE_CPP_SRC}/tools__ret_vals.cpp
    #
    ${omb_SRC}/cryptonote_basic/cryptonote_basic_impl.cpp
    ${omb_SRC}/cryptonote_basic/account.cpp
    ${omb_SRC}/cryptonote_basic/cryptonote_format_utils.cpp

    ${omb_SRC}/crypto/crypto.cpp
    ${omb_SRC}/crypto/hash.c
    ${omb_SRC}/crypto/chacha.c
    ${omb_SRC}/crypto/crypto-ops-data.c
    ${omb_SRC}/crypto/crypto-ops.c
    ${omb_SRC}/crypto/crypto.cpp
    ${omb_SRC}/crypto/hash.c
    ${omb_SRC}/crypto/keccak.c
    ${omb_SRC}/crypto/random.cpp
    ${omb_SRC}/crypto/tree-hash.c
    ${omb_SRC}/crypto/pow_hash/aux_hash.c
    ${omb_SRC}/crypto/pow_hash/cn_slow_hash_soft.cpp
    ${omb_SRC}/crypto/pow_hash/cn_slow_hash_hard_intel.cpp
    ${omb_SRC}/crypto/pow_hash/cn_slow_hash_intel_avx2.cpp
    ${omb_SRC}/crypto/pow_hash/cn_slow_hash_hard_arm.cpp

    ${omb_SRC}/cryptonote_core/cryptonote_tx_utils.cpp
    ${omb_SRC}/common/base58.cpp
    ${omb_SRC}/common/threadpool.cpp
    ${omb_SRC}/common/aligned.c
    ${omb_SRC}/common/util.cpp
    ${omb_SRC}/common/boost_locale.cpp
    ${omb_SRC}/epee/src/hex.cpp
    ${omb_SRC}/epee/src/string_tools.cpp
    ${omb_SRC}/epee/src/memwipe.c
    ${omb_SRC}/epee/src/mlocker.cpp
    ${omb_SRC}/epee/src/wipeable_string.cpp
    ${omb_SRC}/device/device.cpp
    ${omb_SRC}/device/device_default.cpp
    ${omb_SRC}/ringct/rctOps.cpp
    ${omb_SRC}/ringct/rctTypes.cpp
    ${omb_SRC}/ringct/rctCryptoOps.c
    ${omb_SRC}/ringct/rctSigs.cpp
    ${omb_SRC}/ringct/bulletproofs.cc
    ${omb_SRC}/ringct/multiexp.cc
    ${omb_SRC}/mnemonics/electrum-words.cpp
    ${omb_SRC}/vtlogger/logger.cpp
    ${omb_SRC}/contrib/libsodium/src/crypto_verify/verify.c
)

set(boost_DIR ${CMAKE_SOURCE_DIR}/build/boost)

# add_library(boost_atomic STATIC IMPORTED)
# set_target_properties(
#     boost_atomic PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_atomic.a
# )
# #
add_library(boost_chrono STATIC IMPORTED)
set_target_properties(
    boost_chrono PROPERTIES IMPORTED_LOCATION
    ${boost_DIR}/lib/libboost_chrono.a
)
# #
# add_library(boost_date_time STATIC IMPORTED)
# set_target_properties(
#     boost_date_time PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_date_time.a
# )
# #
# add_library(boost_filesystem STATIC IMPORTED)
# set_target_properties(
#     boost_filesystem PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_filesystem.a
# )
# #
# add_library(boost_locale STATIC IMPORTED)
# set_target_properties(
#     boost_locale PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_locale.a
# )
# #
# add_library(boost_program_options STATIC IMPORTED)
# set_target_properties(
#     boost_program_options PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_program_options.a
# )
# #
# add_library(boost_regex STATIC IMPORTED)
# set_target_properties(
#     boost_regex PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_regex.a
# )
# #
# add_library(boost_serialization STATIC IMPORTED)
# set_target_properties(
#     boost_serialization PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_serialization.a
# )
# #
# add_library(boost_signals STATIC IMPORTED)
# set_target_properties(
#     boost_signals PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_signals.a
# )
#
add_library(boost_system STATIC IMPORTED)
set_target_properties(
    boost_system PROPERTIES IMPORTED_LOCATION
    ${boost_DIR}/lib/libboost_system.a
)
#
add_library(boost_thread STATIC IMPORTED)
set_target_properties(
    boost_thread PROPERTIES IMPORTED_LOCATION
    ${boost_DIR}/lib/libboost_thread.a
)
#
# add_library(boost_timer STATIC IMPORTED)
# set_target_properties(
#     boost_timer PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_timer.a
# )
# #
# add_library(boost_wserialization STATIC IMPORTED)
# set_target_properties(
#     boost_wserialization PROPERTIES IMPORTED_LOCATION
#     ${boost_DIR}/lib/libboost_wserialization.a
# )
#
#
#
set(
	EMCC_LINKER_FLAGS
    #unsure if the -I...boost..include is necessary here due to include above
	"-Wall -std=c++11 \
    --bind -s MODULARIZE=1 \
    -Oz \
    --llvm-lto 1 \
    -s WASM=1 \
    -s EXPORT_ES6=1 \
    -s ASSERTIONS=0 \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
    --post-js ${CMAKE_CURRENT_LIST_DIR}/src/module-post.js \
    -s NO_DYNAMIC_EXECUTION=1 \
    -s \"BINARYEN_TRAP_MODE='clamp'\" \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s PRECISE_F32=1 \
    -s 'EXPORT_NAME=\"ombCoreCpp\"' \
    "

    #
    # -O0 \
    # -g \
    # --llvm-lto 0 \
    # -s WASM=1 \
    # -s ASSERTIONS=1 \
    # -s DEMANGLE_SUPPORT=1 \
    # -s ERROR_ON_UNDEFINED_SYMBOLS=0 \

    #
    #
    # --closure 1 \
    # -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"cwrap\"]' \
    # -s DISABLE_EXCEPTION_CATCHING=0 \
    #    -s EXPORTED_FUNCTIONS='[\"_sc_reduce\", \"_sc_reduce32\", \"_sc_check\", \"_sc_add\", \"_ge_fromfe_frombytes_vartime\", \"_ge_mul8\", \"_ge_p1p1_to_p3\", \"_ge_p3_tobytes\", \"_ge_scalarmult\", \"_ge_tobytes\", \"_sc_sub\", \"_sc_mulsub\", \"_ge_scalarmult_base\", \"_sc_0\", \"_ge_double_scalarmult_base_vartime\", \"_ge_double_scalarmult_precomp_vartime\", \"_ge_frombytes_vartime\", \"_ge_dsm_precomp\"]' \
    # -s SAFE_HEAP=1

)


# extract the filename without an extension (NAME_WE)
add_executable(
	ombCoreCpp
	${SRC_FILES}
)
set_target_properties(ombCoreCpp PROPERTIES LINK_FLAGS "${EMCC_LINKER_FLAGS}")
#set_target_properties(ombCoreCpp PROPERTIES SUFFIX ".html")

target_link_libraries(
    ombCoreCpp
    #
    # boost_atomic
    boost_chrono
    # boost_date_time
    # boost_filesystem
    # boost_locale
    # boost_program_options
    # boost_regex
    # boost_serialization
    # boost_signals
    boost_system
    boost_thread
    # boost_timer
    # boost_wserialization
    #
    ${log-lib}
)

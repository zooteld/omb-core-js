
cmake_minimum_required(VERSION 3.4.1)

SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

project(RyoCoreCpp)
#
include_directories("build/boost/include") # must exist already - run bin/build-boost-emscripten.sh
#
include_directories("src")
#
set(RYO_CORE_CPP "contrib/ryo-core-cpp")
set(RYO_CORE_CPP_SRC "${RYO_CORE_CPP}/src")
include_directories("${RYO_CORE_CPP}/src")
#
set(RYO_SRC "${RYO_CORE_CPP}/contrib/ryo-core-custom")
include_directories(${RYO_SRC})
include_directories("${RYO_SRC}/epee/include")
include_directories("${RYO_SRC}/common")
include_directories("${RYO_SRC}/vtlogger")
include_directories("${RYO_SRC}/crypto")
include_directories("${RYO_SRC}/cryptonote_basic")
include_directories("${RYO_SRC}/multisig")
include_directories("${RYO_SRC}/cryptonote_core")
include_directories("${RYO_SRC}/cryptonote_protocol")
include_directories("${RYO_SRC}/wallet")
include_directories("${RYO_SRC}/rpc")
include_directories("${RYO_SRC}/mnemonics")
include_directories("${RYO_SRC}/contrib/libsodium/include") # support sodium/… paths
include_directories("${RYO_SRC}/contrib/libsodium/include/sodium")
#
# keeping test files in a separate source directory
# file(GLOB TEST_SRCS RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} test/test_*.cpp)
#
set(
    SRC_FILES
    #
    src/index.cpp
    #
    ${RYO_CORE_CPP_SRC}/ryo_address_utils.hpp
    ${RYO_CORE_CPP_SRC}/ryo_address_utils.cpp
    ${RYO_CORE_CPP_SRC}/ryo_paymentID_utils.hpp
    ${RYO_CORE_CPP_SRC}/ryo_paymentID_utils.cpp
    ${RYO_CORE_CPP_SRC}/ryo_key_image_utils.hpp
    ${RYO_CORE_CPP_SRC}/ryo_key_image_utils.cpp
    ${RYO_CORE_CPP_SRC}/ryo_transfer_utils.hpp
    ${RYO_CORE_CPP_SRC}/ryo_transfer_utils.cpp
    ${RYO_CORE_CPP_SRC}/ryo_fork_rules.hpp
    ${RYO_CORE_CPP_SRC}/ryo_fork_rules.cpp
    ${RYO_CORE_CPP_SRC}/ryo_wallet_utils.hpp
    ${RYO_CORE_CPP_SRC}/ryo_wallet_utils.cpp
    ${RYO_CORE_CPP_SRC}/ryo_mining_utils.hpp
    ${RYO_CORE_CPP_SRC}/ryo_mining_utils.cpp
    ${RYO_CORE_CPP_SRC}/serial_bridge_index.hpp
    ${RYO_CORE_CPP_SRC}/serial_bridge_index.cpp
    ${RYO_CORE_CPP_SRC}/tools__ret_vals.hpp
    ${RYO_CORE_CPP_SRC}/tools__ret_vals.cpp
    #
    ${RYO_SRC}/cryptonote_basic/cryptonote_basic_impl.cpp
    ${RYO_SRC}/cryptonote_basic/account.cpp
    ${RYO_SRC}/cryptonote_basic/cryptonote_format_utils.cpp

    ${RYO_SRC}/crypto/crypto.h
    ${RYO_SRC}/crypto/crypto.cpp
    ${RYO_SRC}/crypto/hash.c
    ${RYO_SRC}/crypto/chacha.c
    ${RYO_SRC}/crypto/crypto-ops-data.c
    ${RYO_SRC}/crypto/crypto-ops.c
    ${RYO_SRC}/crypto/crypto.cpp
    ${RYO_SRC}/crypto/hash.c
    ${RYO_SRC}/crypto/keccak.c
    ${RYO_SRC}/crypto/random.cpp
    ${RYO_SRC}/crypto/tree-hash.c
    ${RYO_SRC}/crypto/pow_hash/aux_hash.c
    ${RYO_SRC}/crypto/pow_hash/cn_slow_hash_soft.cpp
    ${RYO_SRC}/crypto/pow_hash/cn_slow_hash_hard_intel.cpp
    ${RYO_SRC}/crypto/pow_hash/cn_slow_hash_intel_avx2.cpp
    ${RYO_SRC}/crypto/pow_hash/cn_slow_hash_hard_arm.cpp

    ${RYO_SRC}/cryptonote_core/cryptonote_tx_utils.cpp
    ${RYO_SRC}/common/base58.cpp
    ${RYO_SRC}/common/threadpool.cpp
    ${RYO_SRC}/common/aligned.c
    ${RYO_SRC}/common/util.cpp
    ${RYO_SRC}/common/boost_locale.cpp
    ${RYO_SRC}/epee/src/hex.cpp
    ${RYO_SRC}/epee/src/string_tools.cpp
    ${RYO_SRC}/epee/src/memwipe.c
    ${RYO_SRC}/epee/src/mlocker.cpp
    ${RYO_SRC}/epee/src/wipeable_string.cpp
    ${RYO_SRC}/device/device.cpp
    ${RYO_SRC}/device/device_default.cpp
    ${RYO_SRC}/ringct/rctOps.cpp
    ${RYO_SRC}/ringct/rctTypes.cpp
    ${RYO_SRC}/ringct/rctCryptoOps.c
    ${RYO_SRC}/ringct/rctSigs.cpp
    ${RYO_SRC}/ringct/bulletproofs.cc
    ${RYO_SRC}/ringct/multiexp.cc
    ${RYO_SRC}/mnemonics/electrum-words.cpp
    ${RYO_SRC}/vtlogger/logger.cpp
    ${RYO_SRC}/contrib/libsodium/src/crypto_verify/verify.c
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
    --post-js ${CMAKE_CURRENT_LIST_DIR}/bin/module-post.js \
    -s NO_DYNAMIC_EXECUTION=1 \
    -s \"BINARYEN_TRAP_MODE='clamp'\" \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s PRECISE_F32=1 \
    -s 'EXPORT_NAME=\"RyoCoreCpp\"' \
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
	RyoCoreCpp
	${SRC_FILES}
)
set_target_properties(RyoCoreCpp PROPERTIES LINK_FLAGS "${EMCC_LINKER_FLAGS}")
#set_target_properties(RyoCoreCpp PROPERTIES SUFFIX ".html")

target_link_libraries(
    RyoCoreCpp
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

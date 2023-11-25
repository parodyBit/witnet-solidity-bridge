// SPDX-License-Identifier: MIT

/* solhint-disable var-name-mixedcase */

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "./WitnetRequestBoardTrustableBase.sol";

/// @title Witnet Request Board "trustable" implementation contract.
/// @notice Contract to bridge requests to Witnet Decentralized Oracle Network.
/// @dev This contract enables posting requests that Witnet bridges will insert into the Witnet network.
/// The result of the requests will be posted back to this contract by the bridge nodes too.
/// @author The Witnet Foundation
contract WitnetRequestBoardTrustableDefault
    is 
        WitnetRequestBoardTrustableBase
{
    uint256 internal immutable __reportResultGasBase;
    uint256 internal immutable __sstoreFromZeroGas;

    constructor(
            WitnetRequestFactory _factory,
            bool _upgradable,
            bytes32 _versionTag,
            uint256 _reportResultGasBase,
            uint256 _sstoreFromZeroGas
        )
        WitnetRequestBoardTrustableBase(
            _factory, 
            _upgradable, 
            _versionTag, 
            address(0)
        )
    {   
        __reportResultGasBase = _reportResultGasBase;
        __sstoreFromZeroGas = _sstoreFromZeroGas;
    }


    // ================================================================================================================
    // --- Overrides 'IWitnetRequestBoard' ----------------------------------------------------------------------------

    /// @notice Estimate the minimum reward required for posting a data request.
    /// @dev Underestimates if the size of returned data is greater than `_resultMaxSize`. 
    /// @param _gasPrice Expected gas price to pay upon posting the data request.
    /// @param _resultMaxSize Maximum expected size of returned data (in bytes).
    function estimateBaseFee(uint256 _gasPrice, uint256 _resultMaxSize)
        public view
        virtual override
        returns (uint256)
    {
        return _gasPrice * (
            __reportResultGasBase
                + __sstoreFromZeroGas * (
                    3 + _resultMaxSize / 32
                )
        );
    }

    /// @notice Estimate the minimum reward required for posting a data request with a callback.
    /// @param _gasPrice Expected gas price to pay upon posting the data request.
    /// @param _maxCallbackGas Maximum gas to be spent when reporting the data request result.
    function estimateBaseFeeWithCallback(uint256 _gasPrice, uint256 _maxCallbackGas)
        public view
        virtual override
        returns (uint256)
    {
        return _gasPrice * (
            __reportResultGasBase
                + 3 * __sstoreFromZeroGas
                + _maxCallbackGas
        );
    }


    // ================================================================================================================
    // --- Overrides 'Payable' ----------------------------------------------------------------------------------------

    /// Gets current transaction price.
    function _getGasPrice()
        internal view
        virtual override
        returns (uint256)
    {
        return tx.gasprice;
    }

    /// Gets current payment value.
    function _getMsgValue()
        internal view
        virtual override
        returns (uint256)
    {
        return msg.value;
    }

    /// Transfers ETHs to given address.
    /// @param _to Recipient address.
    /// @param _amount Amount of ETHs to transfer.
    function _safeTransferTo(address payable _to, uint256 _amount)
        internal
        virtual override
    {
        payable(_to).transfer(_amount);
    }   
}
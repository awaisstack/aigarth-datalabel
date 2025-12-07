import { useState } from 'react';
import { qubic } from '../lib/qubic';

interface TransactionResult {
    success: boolean;
    txHash?: string;
    error?: string;
    debug?: any;
}

export function useQubicTransaction() {
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Send transaction from treasury to a destination
     * Used for company deposits and other operations
     */
    const sendTransaction = async (recipientId: string, amount: number): Promise<TransactionResult> => {
        setIsProcessing(true);

        try {
            // Validate inputs
            if (!recipientId || recipientId === "TREASURY_DEPOSIT") {
                // Special case: Company depositing to treasury
                const treasuryId = await qubic.getTreasuryId();
                recipientId = treasuryId;
            }

            // Use the sendTransaction function which handles validation
            const result = await qubic.sendTransaction(recipientId, amount);

            if (result.success) {
                return {
                    success: true,
                    txHash: result.txId,
                    debug: result.debug
                };
            } else {
                return {
                    success: false,
                    error: result.error,
                    debug: result.debug
                };
            }

        } catch (err: any) {
            return {
                success: false,
                error: err.message || "Transaction Failed",
                debug: { error: err.message }
            };
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        sendTransaction,
        isProcessing
    };
}

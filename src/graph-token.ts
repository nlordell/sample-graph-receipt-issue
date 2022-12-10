import { log, ethereum } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/GraphToken/GraphToken";
import { Record } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let record = Record.load("singleton");
  if (record == null) {
    record = new Record("singleton");
  }

  if (event.receipt === null) {
    log.warning(
      "{}: event transaction receipt is null",
      [event.transaction.hash.toHexString()],
    );

    if (record.firstMissingReceipt === null) {
      record.firstMissingReceipt = event.transaction.hash;
      record.save();
    }
  } else {
    let nullField = TransactionReceiptFields.findNull(event.receipt!);
    if (nullField) {
      log.warning(
        "{}: event transaction receipt has null {}",
        [event.transaction.hash.toHexString(), nullField],
      );

      if (record.firstNullReceiptField === null) {
        record.firstNullReceiptField = event.transaction.hash;
        record.save();
      }
    }
  }
}

class TransactionReceiptFields {
  public transactionHash: usize;
  public transactionIndex: usize;
  public blockHash: usize;
  public blockNumber: usize;
  public cumulativeGasUsed: usize;
  public gasUsed: usize;
  public contractAddress: usize;
  public logs: usize;
  public status: usize;
  public root: usize;
  public logsBloom: usize;

  static findNull(receipt: ethereum.TransactionReceipt): string | null {
    let fields = changetype<TransactionReceiptFields>(receipt);
    if (fields.transactionHash === 0) return "transactionHash";
    if (fields.transactionIndex === 0) return "transactionIndex";
    if (fields.blockHash === 0) return "blockHash";
    if (fields.blockNumber === 0) return "blockNumber";
    if (fields.cumulativeGasUsed === 0) return "cumulativeGasUsed";
    if (fields.gasUsed === 0) return "gasUsed";
    if (fields.contractAddress === 0) return "contractAddress";
    if (fields.logs === 0) return "logs";
    if (fields.status === 0) return "status";
    if (fields.root === 0) return "root";
    if (fields.logsBloom === 0) return "logsBloom";
    return null;
  }
}

import { Transfer } from './../generated/Web3CXI/Web3CXI';
import { BigInt } from "@graphprotocol/graph-ts"
import { Web3CXI, Approval } from "../generated/Web3CXI/Web3CXI"
import { ApprovalEvent, TransferEvent, User } from "../generated/schema"

export function handleApproval(event: Approval): void {
	// Create a unique ID for the approval event
	let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

	// Create a new ApprovalEvent entity
	let entity = new ApprovalEvent(id);

	// Set the entity fields based on the event parameters
	entity.owner = event.params.owner;
	entity.spender = event.params.spender;
	entity.value = event.params.value;
  
  entity.save()

}

export function handleTransfer(event: Transfer): void {
	// Create a unique ID for the approval event
	let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

	// Create a new TransferEvent entity
	let entity = new TransferEvent(id);

	// Set the entity fields based on the event parameters
	entity.from = event.params.from;
	entity.to = event.params.to;
	entity.value = event.params.value;

  entity.save();
  
  let fromUser = User.load(event.params.from)
  if (fromUser == null) {
    fromUser = new User(event.params.from)
    fromUser.balance = BigInt.fromI32(0)
  } 
  fromUser.balance = fromUser.balance.minus(event.params.value)
  fromUser.save()

  let toUser = User.load(event.params.to)
  if (toUser == null) {
    toUser = new User(event.params.to)
    toUser.balance = BigInt.fromI32(0)
  }
  toUser.balance = toUser.balance.plus(event.params.value);
	toUser.save();
}
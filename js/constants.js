//These should not be touched
//Estes não devem ser alterados
export const nat = "nat";
export const filter = "filter";
export const NAT = "NAT";
export const Filter = "Filter";
export const tcp = "tcp";
export const udp = "udp";
export const icmp = "icmp";
export const all = "all";
export const any = "any";
export const anywhere = "anywhere";
export const zeroAddr = "0.0.0.0/0";

// String for building HTML ids which later will be splitted. 
export const idSeparator = '___'

//These might be translated
//Estes poderiam ser traduzidos
export const chainsList = 
    {
        "filter" : ["Show all", "INPUT", "FORWARD", "OUTPUT"],
        "nat" : ["Show all", "INPUT", "OUTPUT", "PREROUTING", "POSTROUTING"],
    };
export const showAll = "Show all";
export const selectChainMsg = "Please, select a chain first!";
export const DeleteRule = "Delete rule";
export const deleteRule = "delete rule";
export const invalidIndexMsg = "Internal flaw: Rule not found (rule index is invalid).";
export const flushTable = "flush table";
export const loadSystemInt = "load system interfaces";
export const FailedTo = "Failed to";
export const AddNewRule = "Add new rule"

export function getDeleteMsg(table){ 
    return `Delete ALL ${table} rules from ALL chains?`;
}

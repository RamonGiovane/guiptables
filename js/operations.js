import * as widgets from './widgets.js';
import * as consts from './constants.js';

let interfaceNames = []


export function flush(table) {
    let response;

    cockpit.spawn(["iptables", "-t", table, "-F"], { err: "out" })
        .stream(res => widgets.errorMessage(consts.flushTable, res));

    return response;
}

export function getRuleIndex(table, chain, ruleNumber) {

    let arr = filterTableByChain(table, chain);

    let index = arr.findIndex(element => element.cells[1].textContent == ruleNumber);

    return index < 0 ? index : index + 1;
}

export function deleteRule(ruleData) {

    if (!ruleData || parseInt(ruleData.ruleIndexInChain) <= 0)
        widgets.errorMessage(consts.deleteRule, consts.invalidIndexMsg);

    cockpit.spawn(["iptables", "-t", ruleData.ruleTable,
        "-D", ruleData.ruleChain, ruleData.ruleIndexInChain], { err: "out" })
        .stream(res => widgets.errorMessage(consts.deleteRule, res))

}

export function getInterfaceNames() {

    if (interfaceNames.length > 0)
        return interfaceNames;

    cockpit.spawn(["ls", "/sys/class/net"])
        .then(res => interfaceNames = res.split("\n"))
        .catch(res => widgets.errorMessage(consts.loadSystemInt, res));
}

export function readFile(fileName) {
    let response;
    cockpit.spawn(["cat", fileName])
        .then(res => response = res)
        .catch(err => response = err)

    return response;
}



export function filterTableByChain(table, chain) {

    //Pega as linha da tabela (<tr> dentro do <tbody>) em forma de HTMLCollection
    let arr = Array.from(document.getElementsByClassName(`row-${table}-${chain}`));


    //Filtra e retorna apenas as linhas daquela tabela e daquela cadeia
    let a = arr.filter(function (element) {
        return element.textContent.includes(chain);
    });

    debugger
    return a;
}

export function applyRule(ruleRecord, onSuccessCallback) {
    let args = ["iptables", "-t", ruleRecord.table];

    if (ruleRecord.ruleBelow)
        args.push(...["-I", ruleRecord.chain, ruleRecord.ruleBelow]);
    else
        args.push(...["-A", ruleRecord.chain]);

    if (ruleRecord.outputInterface)
        args.push(...["-o", ruleRecord.outputInterface]);

    if (ruleRecord.inputInterface)
        args.push(...["-i", ruleRecord.inputInterface]);

    if (ruleRecord.protocol && ruleRecord.protocol != "all (default)") {
        args.push(...["-p", ruleRecord.protocol]);
        args.push(ruleRecord.protocolOptions == null ? "" : ruleRecord.protocolOptions);
    }

    if (ruleRecord.source)
        args.push(...["-s", ruleRecord.source]);

    if (ruleRecord.destination)
        args.push(...["-d", ruleRecord.destination]);



    let gotError = false;
    cockpit.spawn(args, { err: "out" })
        .stream(

            res => {

                gotError = true;
                widgets.errorMessage("apply rule", "Command passed:<br>" + args.join(",") + "<br>Error:<i> " + res + "</i>")
            })
        .always(() => {
            if (gotError == false) {
                onSuccessCallback()
            }
        });

}
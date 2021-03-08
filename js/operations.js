import * as widgets from './widgets.js';
import * as consts from './constants.js';
import * as logs from './logging.js';

let interfaceNames = []

export function authenticate(onSuccessCallback, onFailureCallback) {

    let success;
    return cockpit.spawn(["ls", "/root/"], { err: "out" })

        .then(
            () => {
                success = true;
                onSuccessCallback()
            }
        )
        .catch(() => {
            success = false;
            onFailureCallback();
        //})
        //.always(() =>
            //logs.logData([], "Access page", success,
              //  success ? "Access granted" : "Access denied")
        });
}

export function flush(table, onSuccessCallback) {

    //Preset values. Will be changed if error
    let response = "Table flushed.";
    let success = true;

    let args = ["iptables", "-t", table, "-F"];
    cockpit.spawn(args, { err: "out" })
        .stream(res => {
            debugger
            response = res;
            success = false;
            widgets.errorMessage(consts.flushTable, res);
        })
        .always(() => {
            
            if(success) onSuccessCallback();

            let operationTried =
                `Flush ${table} table`;
            logs.logData(args, operationTried, success, response);

        });

}

export function getRuleIndex(table, chain, ruleNumber) {

    let arr = filterTableByChain(table, chain);

    let index = arr.findIndex(element => element.cells[1].textContent == ruleNumber);

    return index < 0 ? index : index + 1;
}

export function deleteRule(ruleData) {

    if (!ruleData || parseInt(ruleData.ruleIndexInChain) <= 0)
        widgets.errorMessage(consts.deleteRule, consts.invalidIndexMsg);

    let result = "Rule deleted", success = true;

    let args = ["iptables", "-t", ruleData.ruleTable,
        "-D", ruleData.ruleChain, ruleData.ruleIndexInChain];

    cockpit.spawn(args, { err: "out" })
        .stream(res => {
            widgets.errorMessage(consts.deleteRule, res)
            result = res;
            success = false;
        })
        .always(() => {

            let operationTried =
                `Delete rule ${ruleData.ruleIndexInChain} from ${ruleData.table}-${ruleData.chain}`;
            logs.logData(args, operationTried, success, result);

        });

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

    return a;
}

export function applyRule(ruleRecord, onSuccessCallback, autoSavePath = null) {
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
        if (ruleRecord.protocolOptions) {
            let opt = ruleRecord.protocolOptions.split(" ");
            args.push(...opt);
        }
    }

    if (ruleRecord.source)
        args.push(...["-s", ruleRecord.source]);

    if (ruleRecord.destination)
        args.push(...["-d", ruleRecord.destination]);

    if (ruleRecord.action)
        args.push(...["-j", ruleRecord.action]);

    let gotError = false;
    let result;

    cockpit.spawn(args, { err: "out" })
        .stream(

            res => {

                gotError = true;
                result = res;
                widgets.errorMessage("apply rule", "Command passed:<br>"
                    + args.join(" ") + "<br>Error:<i> " + res + "</i>")
            })
        .always(() => {
            if (gotError == false) {
                onSuccessCallback();

                result = "Rule applied";

                if (autoSavePath)
                    runIptablesSave(autoSavePath);
            }


            let operationTried;
            if (ruleRecord.ruleBelow)
                operationTried = "Insert rule above " + ruleRecord.ruleBelow;
            else
                operationTried = "Add new rule";


            logs.logData(args, operationTried, !gotError, result);
        });

}

export function isIptablesInstalled(onTrueCallback, onFalseCallback) {
    let error = false;
    cockpit.spawn(["iptables", "-L"], { "error": "out" })
        .catch(() => error = true)
        .always(() => {
            if (error)
                onFalseCallback()
            else
                onTrueCallback()
        });
}


export function installIptables() {
    let error = false;
    let command = ["yum", "-y", "install", "iptables"];
    let msg;

    widgets.raiseInstallationStart();
    cockpit.spawn(command, { "error": "out" })
        .catch((err) => {
            error = true;
            msg = err;
        })
        .always(() => {
            if (error) {
                widgets.raiseInstallationError();
            }
            else {
                widgets.raiseInstallationSuccess();
                msg = "Success."
            }

            logs.logData(command, "Install iptables", !error, msg);
        });
}


export function loadConfigFile(configPath, onSuccessCallback) {


    cockpit.file(configPath).read()
        .done(function (content, tag) {
            if (content == null)
                widgets.errorMessage("load configuration file.",
                    "Application may not work as expected.<br>File not found.");
            onSuccessCallback(content, tag)
        })
        .fail(function (error) {
            widgets.errorMessage("load configuration file.",
                "Application may not work as expected.<br>" + error);
        });
}

export function runIptablesSave(path) {

    cockpit.spawn(["iptables-save"], { "err": "out" })
        .then((res) => {

            saveRulesToPath(res, path);
        })
        .catch((res) => {

            widgets.errorMessage("save tables state", "Error: " + res);


        });
}

function saveRulesToPath(content, path) {

    let result, success;

    cockpit.file(path).replace(content)
        .then(() => {
            result = "Tables state saved at: " + path
            success = true
            widgets.okMessage("Success", result);
        })
        .catch((res) => {

            result = res;
            success = false
            widgets.errorMessage("save tables state", "Error: " + res);


        })
        .always(() =>
            logs.logData(["iptables-save", path], "Save table state", success, result));

}

export function runIptablesRestore(path, requireRefresh) {

    let errorMessage;
    let command = ["iptables-restore", path];
    cockpit.spawn(command, { "err": "out" })
        .stream((res) => {

            errorMessage = res;

        })
        .always(() => {
            let result;
            let success;
            if (errorMessage) {
                result = "Error: " + errorMessage;
                success = false;
                widgets.errorMessage("load tables state", result);
            }
            else {
                result = "Tables state restored from " + path;
                success = true;
                if (requireRefresh)
                    widgets.loadModal(result);

            }

            logs.logData(command, "Restore tables state", success, result);


        });
}

export function saveConfig(config, path) {

    let result;
    let success;
    let str = JSON.stringify(config).split('\",\"').join('\",\n\"');
    cockpit.file(path).replace(str)
        .then(() => {
            result = "Configurations stored at " + path;
            success = true
            widgets.okMessage("Settings saved", result);

        })
        .catch((res) => {
            result = res;
            success = false
            widgets.errorMessage("save settings", "Error: " + res);
        })
        .always(() => {
            logs.logData([], "Change settings file", success, result);
        });
}


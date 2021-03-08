
import * as operations from './operations.js'
import * as widgets from './widgets.js'
import * as consts from './constants.js'
import * as config from './config.js'
import RuleData from './model/RuleData.js';
import RuleRecord from './model/RuleRecord.js';

let activeChains = {"filter" : "Show all", "nat": "Show all"};

export function getActiveChain(table){
    return activeChains[table];
}


export function setActiveChain(table, chain){
    activeChains[table] = chain;
}

/**Runs 'iptables -t [table] -L -v' and fills the HTML table with the response
 * With this command is possible to fetch general info of the 
 * rules set on each iptables layer.
 */
export function addRulesInTable() {

    loadTableRules(consts.nat);

    loadTableRules(consts.filter);
}

/**Runs 'iptables -t [table] -F' which deletes all table rows then
 * reloads the table HTML.
 */
export function flushTable(table) {
    
    operations.flush(table, () => reloadTableRules(table));

}

function loadTableRules(table, chainFilter) {
    if (chainFilter == consts.showAll)
        chainFilter = null;

    cockpit.spawn(["iptables", "-t", table, "-n", "-L", "-v"])
        .then(res => processResponse(res, table, chainFilter))
        .catch(err => widgets.errorMessage("load " + table + " table"));

}

export function reloadTableRules(table, chainFilter) {


    //Destroying rules
    let rules = document.getElementById(table + "-rules-table");


    let children = rules.childNodes;

    for (let i = children.length - 1; i >= 0; i--)
        children[i].remove();

    loadTableRules(table, chainFilter);
}

export function applyRuleCallback(table, chain = null, ruleBelow = null) {

    if(chain == null)
        chain = getActiveChain(table);

    let record = new RuleRecord();

    record.chain = chain;
    record.table = table;
    record.ruleBelow = ruleBelow;

    let checkBox = document.getElementById("input-interface-rule-check");
    if (checkBox.checked)
        record.inputInterface = document.getElementById("input-interface-rule-menu").value;


    checkBox = document.getElementById("output-interface-rule-check");
    if (checkBox.checked)
        record.outputInterface = document.getElementById("output-interface-rule-menu").value;

    checkBox = document.getElementById("protocol-rule-check");
    if (checkBox.checked) {
        record.protocol = document.getElementById("protocol-rule-menu").value;
        record.protocolOptions = document.getElementById("protocol-rule-opts-text").value;
    }
    checkBox = document.getElementById("source-rule-check");
    if (checkBox.checked)
        record.source = document.getElementById("source-rule-text").value;

    checkBox = document.getElementById("destination-rule-check");
    if (checkBox.checked)
        record.destination = document.getElementById("destination-rule-text").value;

    checkBox = document.getElementById("job-rule-check");
    if (checkBox.checked)
        record.action = document.getElementById("job-rule-menu").value;

    operations.applyRule(record, 
        () => reloadTableRules(table, getActiveChain(table)),
        config.getConfiguration().savePath)
}

function splitChainName(element) {
    return element.split(" ")[1];
}

function processResponse(data, table, chainFilter) {

    let text = data.split("\n");

    let hasContent = false;

    let i = 0;

    let chainName;

    //Setting rows
    text.forEach(element => {

        if (element.startsWith("Chain")) {
            chainName = splitChainName(element);
            return;
        }

        if (chainFilter && chainName != chainFilter)
            return;

        if (element.startsWith(" pkts"))
            return;

        if (!element)
            return;

        hasContent = true;

        splitRowAndSetRule(element, table, chainName, i + 1)

        i++;


    });

    if (!hasContent) {
        fillEmptyTable(table)
    }

}   


export function setChainMenu(table) {
    let menu = document.getElementById(table + "-chain-menu");
    menu.innerHTML = "";

    let chains = consts.chainsList[table];
    chains.forEach(c => {
        menu.innerHTML +=
            `
        <option value="${c}">${c}</option>
        `
    });
}

function splitRowAndSetRule(rule, table, chainName, ruleNumber) {

    //Uma linha com regras se torna um array
    let text = rule.trim().split(/[ ,]+/);

    text = checkMissingColumns(text);

    //Accessa a tag html
    let tableRow = document.getElementById(table + "-rules-table");

    //Inicializa a linha com a primeira coluna, o numero da regra
    let cols = `<td>${ruleNumber}</td>`;

    let i = 0;

    let destination = ""

    //Cria as colunas de uma linha
    text.forEach(element => {

        //Montando a coluna 'Destination' que as vezes é composta 
        //por varias palavras e pode ter sido quebrada em fragmentos
        if (i >= 8) {
            destination += formatColumn(element);
            destination += "      ";
        }

        else {
            //Inserindo uma coluna
            cols +=
                `
                <td>
                    ${formatColumn(element)}
                </td>
            `;
        }

        i++;

        //Inserindo a coluna Chain
        if (i == 2) {
            cols +=
                `
                <td>
                    ${chainName}
                </td>
            `;
        }


    });

    //Adiciona por fim a coluna 'Destination'
    cols += `<td>${destination}</td>`


    //Cria a tag de linha propriamente dita
    let tr = document.createElement("tr");

    tr.className = `row-${table}-${chainName}`


    //Insere o conteudo da colunas na linha
    tr.innerHTML =

        `
            <tr>
                ${cols}
            </tr>
        `

    //Adiciona o botão de inserir
    tr.insertBefore(createAddButton(table, chainName, ruleNumber), tr.firstChild);

    //Adiciona o botao de excluir 
    tr.appendChild(createDeleteButton(table, chainName, ruleNumber));

    //Insere a linha no HTML
    tableRow.appendChild(tr);
}

function createAddButton(table, chainName, ruleNumber) {
   
    
   
    let td = document.createElement("td");
    td.id = `add-${table}-${chainName}-${ruleNumber}`;

    let icon = document.createElement("i");
    
    if(activeChains[table] == consts.showAll){
        icon.className = "fa fa-plus-circle grey-plus";
        td.appendChild(icon);
        
        icon.onclick = () =>{
            widgets.tableMessage(table, consts.selectChainMsg);
        };
         
        return td;
    }
    
    
    icon.className = "fa fa-plus-circle";



    let dataToogle = document.createAttribute("data-toggle");
    dataToogle.value = "modal";


    let dataTarget = document.createAttribute("data-target");
    dataTarget.value = "#ruleModal";

    icon.setAttributeNode(dataToogle);
    icon.setAttributeNode(dataTarget);

    icon.addEventListener("click", () =>

        widgets.ruleModal(operations.getInterfaceNames(),
         table, 
         () => applyRuleCallback(table, chainName, ruleNumber),
         chainName)
    );

    td.appendChild(icon);

    return td;

}



function createDeleteButton(table, chainName, ruleNumber) {

    let td = document.createElement("td");
    td.id = `delete-${table}-${chainName}-${ruleNumber}`;

    let icon = document.createElement("i");
    icon.className = "fa fa-trash fa-trash-red";


    let dataToogle = document.createAttribute("data-toggle");
    dataToogle.value = "modal";


    let dataTarget = document.createAttribute("data-target");
    dataTarget.value = "#dangerModal";

    icon.setAttributeNode(dataToogle);
    icon.setAttributeNode(dataTarget);

    icon.addEventListener("click", () =>
        widgets.dangerModal(consts.DeleteRule, () => deleteButtonListener(td.id)));

    td.appendChild(icon);

    return td;
}

/**Intended to execute when user clicks on a trash can icon */
function deleteButtonListener(id) {



    let rule = extractRuleFromId(id);
    operations.deleteRule(rule);
    reloadTableRules(rule.ruleTable);
}


function extractRuleFromId(id) {

    let rule = new RuleData();

    let data = id.split("-");

    rule.ruleTable = data[1];
    rule.ruleChain = data[2];
    rule.ruleNumber = data[3];
    rule.ruleIndexInChain = operations.getRuleIndex(rule.ruleTable, rule.ruleChain, rule.ruleNumber);

    return rule;
}

function checkMissingColumns(arr) {


    ///
    ///Checking if target is missing
    let copy = arr.slice(0, 3);

    if (copy[2] == consts.all || copy[2] == consts.tcp 
        || copy[2] == consts.udp || copy[2] == consts.icmp)
        arr.splice(2, 0, "--");

    ///
    ///

    return arr;

}

function formatColumn(element) {

    if (element == "*")
        return consts.any

    if (element == consts.zeroAddr)
        return consts.anywhere;

    return element;

}

function fillEmptyTable(table) {

    //Accessa a tag html
    let tableRow = document.getElementById(table + "-rules-table");

    let tr = document.createElement("tr");

    //Insere o conteudo da colunas na linha
    tr.innerHTML =

        `
            <tr>
               <td colspan="13">No active rules</td>
            </tr>
        `

    tableRow.appendChild(tr);

}


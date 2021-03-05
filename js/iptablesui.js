
import * as operations from './operations.js';
import * as rules from './rules.js'
import * as widgets from './widgets.js'
import * as consts from './constants.js'

document.addEventListener('readystatechange', event => {
    registerEventListeners();
});



function registerEventListeners() {

    //Pre load interface names
    operations.getInterfaceNames();


    document.getElementById("filter-flush-table").onclick = function () {
        widgets.dangerModal(consts.getDeleteMsg(consts.Filter), () => rules.flushTable(consts.filter));
    };

    document.getElementById("nat-flush-table").onclick = function () {
        widgets.dangerModal(consts.getDeleteMsg(consts.NAT), () => rules.flushTable(consts.nat));
    };


    setChainMenus();

    setAddButtons();
}

function setAddButtons() {

    document.getElementById("nat-add-rule").onclick = (ev) => {

        if (rules.getActiveChain(consts.nat) == consts.showAll) {
            ev.stopPropagation();

            widgets.tableMessage(consts.nat, consts.selectChainMsg);
        }
        else widgets.ruleModal(
            operations.getInterfaceNames(), 
            consts.nat,
            ()=> rules.applyRuleCallback(consts.nat)
        );
    };

    document.getElementById("filter-add-rule").onclick = (ev) => {


        if (rules.getActiveChain(consts.filter) == consts.showAll) {
            ev.stopPropagation();

            widgets.tableMessage(consts.filter, consts.selectChainMsg);
        }

        else widgets.ruleModal(
            operations.getInterfaceNames(),
            consts.filter,
            ()=> rules.applyRuleCallback(consts.filter),     
        );
    };

}



function setChainMenus() {


    
    rules.setChainMenu(consts.filter);

    let chainMenu = document.getElementById("filter-chain-menu");
    chainMenu.onchange = (ev) => {
        widgets.hideTableMessage(consts.filter);
        rules.setActiveChain(consts.filter, ev.currentTarget.value);
        rules.reloadTableRules(consts.filter, ev.currentTarget.value);
    }

    rules.setChainMenu(consts.nat);

    chainMenu = document.getElementById("nat-chain-menu");

    chainMenu.onchange = (ev) => {
        widgets.hideTableMessage(consts.nat);
        rules.setActiveChain(consts.nat, ev.currentTarget.value);
        rules.reloadTableRules(consts.nat, ev.currentTarget.value);
    }

}

function start() {

    rules.addRulesInTable();
}


start();
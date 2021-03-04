
import * as operations from './operations.js';
import * as rules from './rules.js'
import * as widgets from './widgets.js'

document.addEventListener('readystatechange', event => { 
    registerEventListeners();
});



function registerEventListeners(){

    //Pre load interface names
    operations.getInterfaceNames();


    document.getElementById("filter-flush-table").onclick = function(){
        widgets.dangerModal("Delete ALL filter rules from ALL chains?", () => rules.flushTable("filter"));
    }; 
    
    document.getElementById("nat-flush-table").onclick = function(){
        widgets.dangerModal("Delete ALL NAT rules from ALL chains?", () => rules.flushTable("nat"));
    };
    

    setChainMenus();
    
    setAddButtons();
}

function setAddButtons(){
    
    document.getElementById("nat-add-rule").onclick = (ev) =>{
        
        if(rules.getActiveChain("nat") == "Show all"){
            ev.stopPropagation();

            widgets.tableMessage("nat", "Please, select a chain first!");
        }
        else widgets.ruleModal(operations.getInterfaceNames(), "NAT");
    };
    
    document.getElementById("filter-add-rule").onclick = (ev) => {
        
        if(rules.getActiveChain("filter") == "Show all"){
            ev.stopPropagation();

            widgets.tableMessage("filter", "Please, select a chain first!");
        }
        else widgets.ruleModal(operations.getInterfaceNames(), "filter");
    };    

}

function setChainMenus(){
    
    
    debugger
    rules.setChainMenu("filter");

    let chainMenu = document.getElementById("filter-chain-menu");
    chainMenu.onchange = (ev) =>{
        widgets.hideTableMessage("filter");
        rules.setActiveChain("filter", ev.currentTarget.value);
        rules.reloadTableRules("filter", ev.currentTarget.value);
    }

    rules.setChainMenu("nat");

    chainMenu = document.getElementById("nat-chain-menu");
    
    chainMenu.onchange = (ev) =>{
        widgets.hideTableMessage("nat");
        rules.setActiveChain("nat", ev.currentTarget.value);
        rules.reloadTableRules("nat", ev.currentTarget.value);
    }

}

function start(){

    rules.addRulesInTable();  
}


start();
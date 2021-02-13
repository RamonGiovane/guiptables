
import * as rules from './rules.js'
import * as widgets from './widgets.js'

document.addEventListener('readystatechange', event => { 
    registerEventListeners();
});



function registerEventListeners(){
    document.getElementById("nat-save-changes").onclick = function(){
        filterTableByChain("filter", "POSTROUTING");
    };
    
    document.getElementById("filter-save-changes").onclick = function(){
        filterTableByChain("filter", "POSTROUTING");
    };    

    document.getElementById("filter-flush-table").onclick = function(){
        widgets.dangerModal("Delete ALL filter rules", () => rules.flushTable("filter"));
    }; 
    
    document.getElementById("nat-flush-table").onclick = function(){
        widgets.dangerModal("Delete ALL nat rules", () => rules.flushTable("nat"));
    }; 

   
}

function start(){

    rules.addRulesInTable();  
}


start();
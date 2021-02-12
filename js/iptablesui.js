
import {addRulesInTable} from './rules.js'
import * as operations from './operations.js'

window.onload = registerEventListeners;

function registerEventListeners(){
    document.getElementById("nat-save-changes").onclick = function(){
        filterTableByChain("filter", "POSTROUTING");
    };
    
    document.getElementById("filter-save-changes").onclick = function(){
        filterTableByChain("filter", "POSTROUTING");
    };    

   
}









function start(){

    addRulesInTable();

  
}


start();
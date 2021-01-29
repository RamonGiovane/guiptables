
import {addRulesInTable} from './rules.js'
import { getChainData } from './chains.js';




function start(){
    
    let chainData = getChainData()
    
    addRulesInTable(chainData)
}


start();
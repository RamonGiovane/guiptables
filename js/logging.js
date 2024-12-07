import * as widgets from './widgets.js';
import * as config from './config.js';

export function logData(commandArr, operationTried, operationResult, resultMessage){

    //format result message
    if(resultMessage)
        resultMessage = resultMessage.replace("`", "'");

    cockpit.spawn(["date", "+\"%F %T\""])
    .then((date) =>{       
        
        let str = 
            date + `Trying to: ${operationTried}\n$ ${commandArr.join(" ")}`;
        
        str += `\n${operationResult ? "OK" : "ERR"}! ${resultMessage}\n-`;

        writeLogData(str);
    });
}

export function writeLogData(txt) {
    cockpit.spawn(['sh', '-ec', `echo "${txt}" | tee -a ${config.getConfiguration().logPath}`], { superuser: 'required' })
    .catch(err => {
        widgets.errorMessage("write log file", err)

    })
}

export function loadLogs(){
    //create file if doesn't exist
    cockpit.spawn(['sh', '-ec', `touch ${config.getConfiguration().logPath}`], { superuser: 'required' })
    .then( () =>{
        //read file
        cockpit.spawn(['sh', '-ec', `cat ${config.getConfiguration().logPath}`], { superuser: 'required' })
        .then((res) =>{
            widgets.logModal(res.split("\n-\n"))
        })
        .catch(err => widgets.errorMessage("load log file", err))
    }).catch(err => widgets.errorMessage("load log file", err));
}


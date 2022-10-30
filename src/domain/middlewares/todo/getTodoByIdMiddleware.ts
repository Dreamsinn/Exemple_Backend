import { param } from "express-validator";

export const getTodoByIdMiddleware = [
    param('id')
        .isFloat(),
    // query('color')              //para querys solo hace falta especificarlo en el midleware, no en la ruta
        // .custom(value=>{     //en customs retrun false = error inespecifico ; throw new Error('Must be defined') = error + mensaje de error
        //     if(value === undefined){
        //         throw new Error('Must be defined')
        //     }

        //     if(!isNaN(Number(value)) && value !== ''){
        //         throw new Error("Can't be a number")
        //     }
            
        //     return true      // necesario, sino sin un caso sin error seimpre dara error
        // })
        // .optional()
        // .notEmpty()
    
]
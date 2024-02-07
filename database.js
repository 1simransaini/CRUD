var mysql=require("mysql2");
const dotenv=require('dotenv');
const { response } = require("express");
dotenv.config();

let instance =null;

var connection=mysql.createConnection({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
});

class dbservice{
    static getdbserviceInstance(){
        return instance!=null && instance!=undefined ? instance : new dbservice();
        //here due to this we don't need to make object of this class getdbserviceInstance
    }

    async getAllData(){
        try{
            const response= await new Promise((resolve,reject)=>{
                const query="SELECT * FROM cruddata;";

                connection.query(query,(err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            console.log(response); //since we do not have any data at starting so this will show us [] that is empty array
            return response;
        }
        catch (err){
            console.log(err);
        }
    }

    async insertNewName(name){
        try{
            const date_added=new Date();
            const insertId= await new Promise((resolve,reject)=>{
                const query="INSERT INTO cruddata (name,date_added) VALUES (?,?);";

                connection.query(query,[name,date_added],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    // resolve(result.insertId);
                    resolve(result.insertId);
                });
            });
            return{
                id: insertId,
                name: name,
                date_added: date_added
            };
            // return insertId;
            // console.log(insertId); 
            // return response;
            // const insertID = result && result.insertId;

            // if (insertID !== undefined) {
            //     console.log("Insert successful. ID:", insertID);
            //     // You might want to return insertID or some other response here
            // } else {
            //     console.error("Insert failed. No insertId in the result.");
            //     // Handle the error or return an appropriate response
            // }
        }
        catch (err){
            console.log(err);
        }
    }

    async deleteRowById(id){
        try{
            id=parseInt(id,10);
            const response= await new Promise((resolve,reject)=>{
                const query="DELETE FROM cruddata WHERE id= ?";

                connection.query(query,[id],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            // console.log(response);
            return response === 1 ? true : false;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    async updateNameById(id,name){
        try{
            id=parseInt(id,10);
            // console.log("Parsed ID:", id);

            // if (isNaN(id)) {
            //     // Handle the case where the id is not a valid integer.
            //     console.error("Invalid ID:", id);
            //     return false;
            // }

            const res= await new Promise((resolve,reject)=>{
                const query="UPDATE cruddata SET name= ? WHERE id= ?;";

                connection.query(query, [name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            // console.log(res);
            return res === 1 ? true : false;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    async searchByName(name){
        try{
            const response= await new Promise((resolve,reject)=>{
                const query="SELECT * FROM cruddata WHERE name= ? ;";

                connection.query(query,[name],(err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            console.log(response); //since we do not have any data at starting so this will show us [] that is empty array
            return response;
        }
        catch (err){
            console.log(err);
        }
    }
}
// module.exports=connection;
// module.exports=dbservice;

module.exports={connection,dbservice}
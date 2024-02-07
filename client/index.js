document.addEventListener('DOMContentLoaded',function () {
    fetch('http://localhost:5000/getAll')
    .then(response=>response.json())
    .then(data=>loadHTMLTable(data['data']));

});

document.querySelector('table tbody').addEventListener
('click',function(event){
    // console.log(event.target)
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn"){
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn= document.querySelector('#update-row-btn');
const searchBtn= document.querySelector('#search-btn');

searchBtn.onclick=function(){
    const searchValue=document.querySelector('#search-input').value;
    fetch('http://localhost:5000/search/'+searchValue)
    .then(res=>res.json())
    .then(data=>loadHTMLTable(data['data']));

}

function deleteRowById(id){
    fetch('http://localhost:5000/delete/' + id,{
        method: 'DELETE'
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            location.reload();
            // window.location.href = window.location.href;
        }
    });
}

function handleEditRow(id){
    const updateSection=document.querySelector('#update-row');
    updateSection.hidden= false;
    document.querySelector('#update-row-btn').dataset.id=id;
}

updateBtn.onclick= function(){
    const updateNameInput=document.querySelector('#update-name-input');

    // console.log(updateNameInput);

    // let id = updateBtn.dataset.id;  // Use updateBtn.dataset.id  -----Method that helped to pass the id 

    // console.log("Parsed ID:", id);
    // console.log("updateNameInput.dataset.id ID:", updateNameInput.dataset.id);
    // console.log("updateNameInput.value ID:", updateNameInput.value);

    // id = parseInt(id, 10);                      -----Method that helped to pass the id 

    // console.log("Parsed ID:", id);
    // console.log("updateNameInput.value ID:", updateNameInput.value);

    fetch('http://localhost:5000/update',{
        method:'PATCH',
        headers:{
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            // id: updateNameInput.dataset.id;     this was not passing the id value was giving undefined
            // id: id,         -----Method that helped to pass the id 
            id: updateBtn.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(res => res.json())
    .then(data =>{
        if(data.success){
            location.reload();
        }
    })
}

const addBtn=document.querySelector('#add-name-btn');

addBtn.onclick= function(){
    const nameInput=document.querySelector('#name-input');
    const name=nameInput.value;
    nameInput.value=""

    fetch('http://localhost:5000/insert',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({name:name})
    })
    .then(res=>res.json())
    .then(data=>insertRowIntoTable(data['data']));
    
}

function insertRowIntoTable(data){
    console.log(data);
    const table=document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml="<tr>";

    for(var key in data){
        if(data.hasOwnProperty(key)){
            if(key === 'date_added'){
                data[key]= new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class="delete-row-btn"
    data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn"
    data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if(isTableData){
        table.innerHTML = tableHtml;
    }
    else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
        // table.querySelector('.no-data').remove();
    }
}


function loadHTMLTable(data){
    const table=document.querySelector('table tbody');

    // console.log(data); gives[] till 37:07

    if(data.length === 0){
        // we put table data inside table row (colspan=5 will write it in all cols)
        table.innerHTML= "<tr><td class='no-data' colspan='5'> No Data </td></tr>";
        return; //if no data just go back
    }

    let tableHtml="";
    data.forEach(function ({id,name,date_added}){
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        // tableHtml += `<td>${date_added}</td>`;        converted to get the good local time was getting 2024-01-24T04:04:21.000Z
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`; 
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;       //send data id to fecth which id to delete
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;;
        tableHtml += "</tr>";
    });

    table.innerHTML=tableHtml;
}
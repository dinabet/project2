/// <reference path="jquery-3.6.0.js" />

$(function () {  

  $("#choiceDiv").hide();

  localStorage.clear();
  $("#loaderWindow").show();
  //Loading data at the opening
  getUpdatedData();

 function displayCoins(coins) {   
      $("#containerDiv").empty();
            for (const coin of coins) {
          let index = coins.indexOf(coin);
          const card = `
              <div class="card" id = "${coin.name}">
                  ${index}<br>
                  ${coin.name}/ ${coin.symbol} <input type="checkbox" id="${coin.symbol}"  value = "${index}">
                    <br>
                    Price/ILS: ${coin.market_data.current_price.ils}₪ <br>
                    <button id= "${coin.id}" type="button"  class ="buttonStyle"
                     data-toggle="collapse" data-target ="#${coin.id}2">MORE INFO</button>
                     <div id = "${coin.id}2" class = "collapse"> </button>
              </div>`
                  $("#containerDiv").append(card);             
            }
            $("#loaderWindow").hide();
           };

function getUpdatedData(){
   $("#loaderWindow").show();   
$.ajax({  url: "https://api.coingecko.com/api/v3/coins",
 error: err => alert("Error: " + err.message),
  success: coins => displayCoins(coins)
});
$("#loaderWindow").hide();
};

//Displaying more info about the coin in the card
$("#containerDiv").on("click", ".card > button", function () {if (document.getElementById(`${this.id}`).innerHTML==="CLOSE")
{document.getElementById(`${this.id}`).innerHTML="MORE INFO"} else {document.getElementById(`${this.id}`).innerHTML="CLOSE"};
   $("#loaderWindow").hide();
   if(document.getElementById(`${this.id}`).innerHTML=="CLOSE"){ 
    $("#loaderWindow").show(); 
if (localStorage.length==0){
 $.ajax({
     url: "https://api.coingecko.com/api/v3/coins/" + this.id,
     error: err => alert("Error: " + err.message),
     success: coin => $(this).next().html(displayDetails(coin)) 
   }); }
   else
      { arr = JSON.parse(localStorage.getItem("arr"));const idDetails = arr.find(obj=>obj.idInfo==this.id);
      if(idDetails==undefined){$.ajax({
      url: "https://api.coingecko.com/api/v3/coins/" + this.id,
      error: err => alert("Error: " + err.message),
      success: coin => $(this).next().html(displayDetails(coin))
      }); } else {$(this).next().html(displayExistingDetails(idDetails));}   } ;} 
 
 });   


function displayDetails(coin) {        
const infoArr = []; 
const coinInfoObject = {idInfo:`${coin.id}`,
                       name:`${coin.name}`,
                       imgInf:`${coin.image.small}`,
                      symb:`${coin.symbol}`,
                      priceUsd:`${coin.market_data.current_price.usd}`};
saveInLocalStorage(infoArr,coinInfoObject);   
updateStoredArr(coin) ; $("#loaderWindow").hide();               
const details = `
   Name: ${coin.name} <br>
   <img src = ${coin.image.small}> <br> 
   symbol: ${coin.symbol} <br>
   Price/USD: ${coin.market_data.current_price.usd}$`;          
 return(details);    
}

function displayExistingDetails(obj){
 $("#loaderWindow").hide();
const details = `
Name: ${obj.name} <br>
<img src = ${obj.imgInf}> <br> 
symbol: ${obj.symb} <br>
Price/USD: ${obj.priceUsd}$             
`;        
return(details);    
}

function saveInLocalStorage(arr,item){ 
if(localStorage.length==0){arr.unshift(item);localStorage.setItem("arr",JSON.stringify(arr))}
else{  
arr = JSON.parse(localStorage.getItem("arr"));
const idDetails = arr.find(obj=>obj.idInfo==item.idInfo);
if (idDetails==undefined) {arr.unshift(item)} ;
localStorage.setItem("arr",JSON.stringify(arr));}
} 

async function updateStoredArr(item) {
try {
   const arr = await deleteItemAfterDelay(item);
   localStorage.setItem("arr",JSON.stringify(arr));
}
catch(err) {
   alert(err);
}
}
//deleting the info after that it has been kept for two minutes
function deleteItemAfterDelay(item) {
return new Promise((resolve, reject) => {
   setTimeout(() => {
       let arr = JSON.parse(localStorage.getItem("arr"));
       const index = arr.indexOf(item);
       arr.splice(index,1);
          resolve(arr);
          reject("Failed to delete: " + arr[index]);       
   },120000);
});
}
// shoosing the 5 coins for statistics and displaying the list
let chosenCurr = [];
$("#containerDiv").on("click", ".card > input", function () { 
  const symbChoice = this.id;
  const indexChoice = this.value;
  const choice = {index:indexChoice,currSymb:symbChoice} 
if(this.checked ==true && chosenCurr.length<5){chosenCurr.push(choice) } 
else {this.checked=false;chosenCurr = chosenCurr.filter(choice => choice.index != indexChoice)};       
if(chosenCurr.length===5) {displayListOfChosenCurrencies(); $("#containerDiv").hide();$("#choiceDiv").show();};
});

function displayListOfChosenCurrencies(){
$("#choiceDiv").empty();
const hh = `<h3> Chosen List for statistics</h3>`;
$("#choiceDiv").append(hh);
for (const item of chosenCurr) {        
  const MyChoosenCurr = `
      <div id = "choosenList" >
        ${item.index} : ${item.currSymb} <button id = "${item.index}" type="button" class="btn-close cancelThisChosenCoin" aria-label="Close"></button>
           <br>                           
          </div>`;
   $("#choiceDiv").append(MyChoosenCurr);};
   let chartButtonAndOther = `<div id="footDiv" >
            return to change the chosen list <br>
            or to press on Report to see Graph
           <button  class="closeChoiceWindow" >RETURN</button>
           </div> ` 

      $("#choiceDiv").append(chartButtonAndOther); 
      
  };
  
  $("#choiceDiv").on("click", "#choosenList > .cancelThisChosenCoin", function () {              
         const indexChoice = this.id;            
         chosenCurr = chosenCurr.filter(choice => choice.index != indexChoice);         
           
       $("#choiceDiv").hide();$("#containerDiv").show();
       let x = document.getElementById("containerDiv").querySelectorAll("input"); 
       x[indexChoice].checked= false;        
         
     });

    $("#HomeLink").click(function () {  
     $("#choiceDiv").hide();  
         getUpdatedData();chosenCurr = [];
         $("#containerDiv").show();      
 
    });
         
    $("#choiceDiv").on("click", "#footDiv > .closeChoiceWindow", function () {
      $("#choiceDiv").hide();$("#containerDiv").show();
   });                         
        
    
   
   $("#cancelChoice").click(function(){ 
      $("input").attr("checked",function(){
        this.checked = false;
        });     
       chosenCurr = [];
       $("#choiceDiv").hide();$("#containerDiv").show();
 });
 
 //displaying the graph price/time for the five chosen currencies
 $("#chartLink").on("click",function(){ if (chosenCurr.length<5) {alert ("please choose 5 currency ")} else{
  $("#containerDiv").empty();
  const canvasDisplayCharts = `<br><button id ="chartsToHome">HOME</button> <h3></h3><br><canvas id="myCanvas" >`
  $("#containerDiv").append(canvasDisplayCharts);
  drawingEachIntervalOfTime();};
 
   });
  
  //calling USD price data for the 5 chosen coins 
 function getUSDpriceForStat(){     
    const coinOne = chosenCurr[0];const coinTwo = chosenCurr[1];const coinThree = chosenCurr[2];
    const coinFoor = chosenCurr[3];const coinFive = chosenCurr[4];    
    const symbArr =[coinOne.currSymb,coinTwo.currSymb,coinThree.currSymb,coinFoor.currSymb,coinFive.currSymb];    
    const ticker = () =>  [`${coinOne.currSymb}`,`${coinTwo.currSymb}`,`${coinThree.currSymb}`,`${coinFoor.currSymb}`,`${coinFive.currSymb}`]
    const extractCoin = ticker().slice(0, 50); 
    const urlA = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + extractCoin + "&tsyms=USD&limit=300";
    let result = null;
  $.ajax({
    url: urlA,
    async: false,//  makes a synchrously data call to cryptocompare
    dataType: "json",
    success: function(data) {
      result = data;
    }
  });    
   const USDpriceArr  = Object.keys(result).map(key => result[key]?.["USD"]);
   const newArrSymbPriceUSD=[];
for (let i=0;i<USDpriceArr.length;i++){
      const coinInfoObject = {symbC:`${symbArr[i]}`,
                        USDprice:`${USDpriceArr[i]}`};                       
     newArrSymbPriceUSD.push(coinInfoObject);}   
     return newArrSymbPriceUSD;
}
function drawTheFirstDotAndLegendAndTitle(){
  symbPriceArr = getUSDpriceForStat();        
  let MaxPrice = +symbPriceArr[0].USDprice;  
for (let i=0;i<symbPriceArr.length;i++){const price = symbPriceArr[i].USDprice;
   (+price>+MaxPrice||+price==+MaxPrice)? MaxPrice = price:MaxPrice;
} 
const myCanvas = document.getElementById("myCanvas");

$("#containerDiv h3").text(`USD Price vs time for the currencies ${symbPriceArr[0].symbC} ${symbPriceArr[1].symbC}
${symbPriceArr[1].symbC}  ${symbPriceArr[2].symbC} ${symbPriceArr[3].symbC}`)
let CanvHeight = myCanvas.height; 
 
const scaleCanv = (CanvHeight/MaxPrice)*0.75;
for (let i=0;i<symbPriceArr.length;i++){
  const priceCoord = CanvHeight - scaleCanv * symbPriceArr[i].USDprice;
  const textLegend = `${symbPriceArr[i].symbC}`;
    drawCoordinates(i,0,priceCoord,textLegend);}
}




function drawThe5CurrenciesPriceDot(symbPriceArr,t){
    symbPriceArr = getUSDpriceForStat();        
  let MaxPrice = +symbPriceArr[0].USDprice;  
for (let i=0;i<symbPriceArr.length;i++){const price = symbPriceArr[i].USDprice;
   (+price>+MaxPrice||+price==+MaxPrice)? MaxPrice = price:MaxPrice;
} 
const myCanvas = document.getElementById("myCanvas");
let CanvHeight = myCanvas.height; 
 
const scaleCanv = (CanvHeight/MaxPrice)*0.75;
for (let i=0;i<symbPriceArr.length;i++){
  const priceCoord = CanvHeight - scaleCanv * symbPriceArr[i].USDprice;
  
    drawCoordinates(i,t,priceCoord,'');}
}

async function drawingEachIntervalOfTime() {

  try { const d = new Date(); let tStart = (d.getSeconds());
      getNewPriceAfterInterval(tStart);
    
  }
  catch(err) {
     alert("err");
  }}
  
 function getNewPriceAfterInterval(t0) {
    return new Promise((resolve, reject) => {
      const d = new Date(); let t = (d.getSeconds()); let min=d.getMinutes(); console.log('start min',min);
      drawTheFirstDotAndLegendAndTitle();
       setInterval(() => {
        const d = new Date(); let t = (d.getSeconds()); let minNow= d.getMinutes();
          console.log("min now",minNow);        
          let arr = getUSDpriceForStat();
          let diff =Math.abs(minNow-min); let diffEnteger= Math.floor(diff);
         drawThe5CurrenciesPriceDot(arr,(t-t0)+diffEnteger*60);
          
           resolve(arr);         
          reject("ERROR NEED TO PRESS CHART BUTTON TO GET THE CANVAS");                   
              },2000);})}

   $("#containerDiv").on("click","#chartsToHome",function(){
    location.reload();
      chosenCurr = [];
      getUpdatedData();
    });
//My search button is case sensitive
    $("#searchButton").on("click",function (){
     $(".card").css("background-color", "rgb(205, 118, 118");
     const searchedValue = $("input").val();      
    $(".card[id*="+searchedValue+"]").css("background-color", "lightGray");    
   });

   
  function drawCoordinates(i,t,price,text){
   const arrColor = ["brown","black","red","purple","darkGreen"]
   const canvas = document.getElementById("myCanvas");    
   const ctx = canvas.getContext("2d");
  ctx.fillStyle = arrColor[i];  
  ctx.beginPath();
  ctx.arc(t, price,1, 0, 2 * Math.PI);
  ctx.fill();
  ctx.font = "Times";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width*0.90, price)
  } 
  
  
  $("#aboutLink").on("click",function(){
    $("#containerDiv").empty();
  const aboutMeAndThisProject = `
  <h1>About Me</h1>
  My name is Dinah Nabet <br>
 <img  src="/project2/virtual-coin.png" /><br><br>
  <h1>About this Project</h1>
  
  This project has the aim to give information on virtual currencies<b>
  The differents coins name ,Symbol and ILS price are displayed on cards<br>
  The picture and the USD price are given by clicking on 'MORE INFO' button<br>
  The search for a specific currency for which the name contains the searched text is case sensitive<br>
  The reports are given only for a group of five currencies not for less<br>
  The choice of these five currencies can be made on the coins cards display but when five currencies have been<br>
  chosen ,the deleting of one of the choice can be done also on the window displaying the five coins window<br>
  The developping languages used are HTML+CSS,Javascript Jquery and Ajax<br>  
  The data about these currencies is taken from the web-sites:coingecko.com,cryptompare.com(using their API)<br>
  I should use also canvas.com/jquery-charts,but I did read the last page of the project instructions only
  when I finished to work on the project<br>
  One more subject for me to study!!!
  <br><br><br><br><br>
 `
   
  $("#containerDiv").append(aboutMeAndThisProject);

  })
     }); 


// START OF  js plugin niceScroll

$("html").niceScroll({
    cursorcolor: "#198754", // change cursor color in hex
    cursoropacitymin: 0, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
    cursoropacitymax: 1, // change opacity when cursor is active (scrollabar "visible" state), range from 1 to 0
    cursorwidth: "12px", // cursor width in pixel (you can also write "5px")
    cursorborder: "0px solid #fff", // css definition for cursor border
    cursorborderradius: "5px", // border radius in pixel for cursor
    zindex: 99999 , // change z-index for scrollbar div
    scrollspeed: 60, // scrolling speed
    mousescrollstep: 40, // scrolling speed with mouse wheel (pixel)
    autohidemode: false, // how hide the scrollbar works, possible values: 
    background: "#2b3035de", // change css for rail background

});

// END OF js plugin niceScroll



// START OF  getting all countries and categories list 

var categoriesData = [];
var countriesData = [];

// start of getting categories list 
    jQuery.ajax({ 
    url: 'https://www.themealdb.com/api/json/v1/1/categories.php', 
    type:'GET',
    async: false,
    success:function(data){

        categoriesData = data.categories ;
        fillTheSelect(categoriesData , "[name=category]" , "strCategory" );
        
    }
    });
    
// end of geting categories list 



// start of getting countries list 

    jQuery.ajax({ 
        url: 'https://www.themealdb.com/api/json/v1/1/list.php?a=list', 
        type:'GET',
        async: false,
        success:function(data){
    
            countriesData = data.meals ;
            fillTheSelect(countriesData , "[name=country]" , "strArea" );
            
        }
        });

// end of getting countries list 
    

// START OF function to fill the html inputs and selectboxes with values

function fillTheSelect(array , element , property){


    $(element).html("").append(`<option value="*">All</option>`);
    array.forEach((index) => {

    $(element).each(function(){

             $(this).append(`<option value="${index[property]}">${index[property]}</option>`) ;
            
      })

    // document.querySelectorAll(element).forEach((ele) => {
    //     ele.innerHTML += ` <option value="${index.strCategory}">One</option>` ;
    // })

    });




}
// END OF function to fill the html inputs and selectboxes with values


// END OF getting all countries and categories list 








// START OF getting all the url parameters like $_GET 


AllUrlParameters = window.location.search;
const urlParams = new URLSearchParams(AllUrlParameters);


const PAGEID = urlParams.get('PageId');
const COUNTRY = urlParams.get('country');
const CARDSNUM = urlParams.get('CardsNum')
const CATEGORY = urlParams.get('category');
const SEARCH = urlParams.get('search');



// END OF getting all the url parameters like $_GET 




// START OF here is some stucture control to decide which array to run with PaginateAndBuild function
// JS WILL READ THE URL AND DECIDE WhICH FUNCTION TO RUN / WhICH DATA TO DISPLAY
if( COUNTRY == null && CATEGORY == null && SEARCH == null ){

    PaginateAndBuild(GetRandom());

} else if ( COUNTRY != null && CATEGORY != null ) {


    if(PAGEID == null && CARDSNUM == null  ){
        PaginateAndBuild(GetCountryAndCategoryData(COUNTRY,CATEGORY) );
    } else if (PAGEID != null && CARDSNUM == null ) {
        PaginateAndBuild(GetCountryAndCategoryData(COUNTRY,CATEGORY) , PAGEID );
    } else if (CARDSNUM != null && PAGEID != null  ) {
        PaginateAndBuild(GetCountryAndCategoryData(COUNTRY,CATEGORY) , PAGEID , CARDSNUM );
    }


} else if( SEARCH != null ) {

    if(PAGEID == null && CARDSNUM == null  ){
        PaginateAndBuild(GetSearchData(SEARCH) );
    } else if (PAGEID != null && CARDSNUM == null) {
        PaginateAndBuild(GetSearchData(SEARCH) , PAGEID );
    } else if (CARDSNUM != null && PAGEID != null  ) {
        PaginateAndBuild(GetSearchData(SEARCH) , PAGEID , CARDSNUM );
    }


}


// END OF THE stucture control to decide which array to run with PaginateAndBuild function




// START OF PaginateAndBuild ACCEPT three parameters , the DataArray , PageId , CardsNum
// DataArray is the array that we want to get pagination from 
// PageId is the page number , important to decide which items to get from the  DataArray
// CardsNum is the number of cards or items to display in one page

function PaginateAndBuild( DataArray , PageId = 1 , CardsNum = 6){



    console.log( DataArray , PageId , CardsNum );




let index = PageId * CardsNum ;
let startIndex = index - CardsNum ;
let lastIndex = index - 1 ;
let reminder = +DataArray.length % +CardsNum;
let NumberOfPosiblePages ;

// DECIDING THE VALUE OF NumberOfPosiblePages
if( reminder === 0  ){
    // IF THE REMINDER == 0 then there is no reminders
    NumberOfPosiblePages = Math.floor(+DataArray.length / CardsNum) ;
} else if(reminder != 0){
    // IF THE REMINDER != 0 then there is reminders AND we have to add a new page for reminder items
    NumberOfPosiblePages = Math.floor(+DataArray.length / CardsNum ) + 1 ;

}

// END OF DECIDING THE VALUE OF NumberOfPosiblePages

let arrayPortion = [];
arrayPortion.length = 0 ;


if( PageId <= NumberOfPosiblePages ){


    // PageId < NumberOfPosiblePages
if( +PageId === +NumberOfPosiblePages && reminder != 0 ){
 
    for(i = startIndex ; i < +startIndex + +reminder ; i++ ){
        arrayPortion.push( DataArray[i] );
    }

    
    ShowCardsData(arrayPortion , 200);
    
    ShowPagination(DataArray , CardsNum , PageId , reminder );
    

} else {

    for(i = startIndex ; i <= lastIndex ; i++ ){

        arrayPortion.push( DataArray[i] );
        
    }
    


    // start of run ShowCardsData to display cards
    ShowCardsData(arrayPortion , 200);
    // end of run ShowCardsData to display cards

    // start of run ShowPagination to display pagination
    
    ShowPagination(DataArray , CardsNum , PageId , reminder );

    // end of run ShowPagination to display pagination
    
 

    

}


} else {
    ShowCardsData(arrayPortion , 404);
}























}


// END OF PaginateAndBuild ACCEPT three parameters , the DataArray , PageId , CardsNum





































// START OF function to display the MODAL 


var ModelData = [];

function ModelDetails(dataId) {


    dataId = Number(dataId);
        

        jQuery.ajax({ 
            url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dataId}`, 
            type:'GET',
            success:function(data){
        
                ModelData = data.meals ;

$("#modalTitle").html(`${ModelData[0].strMeal}`)
$("#strMealThumb").attr('src' , `${ModelData[0].strMealThumb}`)
$("#strYoutube").attr('src',`${ModelData[0].strYoutube.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/")}`)
$("#strArea").html(`${ModelData[0].strArea}`)
$("#strCategory").html(`${ModelData[0].strCategory}`)
$("#strInstructions").html(`${ModelData[0].strInstructions}`)
$("#strTags").html(`${ModelData[0].strTags}`)
strTags

let Ingredients ;
let Measures;
 Ingredients = "" ;
 Measures = "" ;

for(i = 1 ; i < 20 ; i++){
if(ModelData[0]['strIngredient'+i] !== null && ModelData[0]['strIngredient'+i].length > 0 && ModelData[0]['strMeasure'+i] != " "  ){
    Ingredients += ` <li  > ${ModelData[0]['strIngredient'+i]} </li> `;

}
if(ModelData[0]['strMeasure'+i] !== null && ModelData[0]['strMeasure'+i].length > 0 && ModelData[0]['strMeasure'+i] != " "  ){
    Measures += ` <li  > ${ModelData[0]['strMeasure'+i]} </li> `;

}
    
}


$("#strIngredients").html(`${Ingredients}`)
$("#strMeasures").html(`${Measures}`)

                
            }
            });



        }


// END OF function to display the MODAL 







// START OF function to display the CARDS 



function ShowCardsData(array , status){

    cardsFrame.innerHTML = "";


    if(status == 200){

        for (const key in array) {

            console.log(array[key])
        
            cardsFrame.innerHTML += ` 
            
        
        
        
            <div class="card my-2 w-25 mx-2  " >
            <img class="card-img-top" src="${array[key].strMealThumb}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${array[key].strMeal}</h5>
              <p class="card-text">...</p>
              <a href="#" class="btn btn-success" data-bs-toggle="modal" onclick="ModelDetails(${array[key].idMeal})" data-bs-target="#DetailsModal" >More Details</a>
            </div>
          </div>
            
            
            
            ` ;
        }

    } else {
cardsFrame.innerHTML = `<div class="mx-auto"> 
<h2 class="text-center" > 404 this page is not found </h2>
<br> <img class="mx-auto"  src="https://i.pinimg.com/originals/23/73/6e/23736e5af84855ef8458126d8775732b.jpg">

</div>
` ;
    }




}



// END OF function to display the CARDS 


// START OF function to display the THE PAGINATION 

function ShowPagination(array , CardsNum , currentPage , reminder ){

if(reminder === 0){
    numberofpages =   Math.floor(array.length / CardsNum );

} else {
    numberofpages = Math.floor(array.length / CardsNum ) + 1 ;

}
    pagination = document.querySelector('.pagination');
    pagination.innerHTML = "";


    console.log('current Page' + currentPage )
    console.log('number of Pages' + numberofpages )

    searchOrcountry = "" ;
    if(SEARCH != null){
      searchOrcountry = "?search="+SEARCH
    
    } else if(CATEGORY != null && COUNTRY != null){
      searchOrcountry = "?category="+CATEGORY+"&country="+COUNTRY
    
    } 

    
if( currentPage == 1 ){
    pagination.innerHTML += `
    <li class="page-item disabled ">
    <a href ="${location.pathname + searchOrcountry + "&" +"PageId=" + Number( +currentPage - +1 ) } " class="page-link">Previous</a>
  </li>
    
    ` ;
} 

if( currentPage > 1  ){
    pagination.innerHTML += `
    <li class="page-item  ">
    <a href ="${location.pathname + searchOrcountry + "&" +"PageId="+ Number( +currentPage - +1 ) }" class="page-link">Previous</a>
  </li>
    
    ` ;
} 



for( i = 1 ; i <= numberofpages ; i++  ){




if( i == currentPage ){
    pagination.innerHTML += `
    <li class="page-item active ">
    <a href ="${location.pathname + searchOrcountry + "&" +"PageId="+currentPage}" class="page-link"> ${currentPage} </a>
  </li>
    
    ` ;
} else{

    pagination.innerHTML += `
    <li class="page-item ">
    <a href ="${location.pathname + searchOrcountry + "&" +"PageId="+i}" class="page-link">${i} </a>
    </li>
    
    ` ;
}




}


if( +currentPage == +numberofpages){
    pagination.innerHTML += `
    <li class="page-item disabled ">
    <a href ="${location.pathname + searchOrcountry + "&" +"PageId="+ Number(+currentPage + +1)}" class="page-link">Next</a>
  </li>
    
    ` ;
} else if( currentPage < numberofpages){
    pagination.innerHTML += `
    <li class="page-item ">
    <a href ="${location.pathname + searchOrcountry + "&" +"PageId="+ Number( +currentPage + +1 )}" class="page-link">Next</a>
  </li>
    
    ` ;

}




}

// END OF function to display the THE PAGINATION 



// START OF function to GET  the THE RANDOM MEALS 

function GetRandom(){
    
    var RandomDataArray = [] ;

    for(i = 0 ; i < 6 ; i++){

jQuery.ajax({ 
    url: 'https://www.themealdb.com/api/json/v1/1/random.php', 
    type:'GET',
    async: false,
    success:function(data){
        // RandomDataArray.push(data.meals[0]);
        RandomDataArray.push({ idMeal: data.meals[0].idMeal , strMeal: data.meals[0].strMeal, strMealThumb: data.meals[0].strMealThumb });
        
    }
});
    
    }

    return RandomDataArray ;


}

// END OF function to GET  the THE RANDOM MEALS 



// START OF function to RERCH FOR MEALS 


function GetSearchData(DataToSearch){

    var thedata = [];
    jQuery.ajax({ 
        url: 'https://themealdb.com/api/json/v1/1/search.php?s='+DataToSearch, 
        type:'GET',
        async: false,
        success:function(data){
    
            thedata = data.meals;

        }
    });


    return thedata ;



}


// END OF function to RERCH FOR MEALS 



// START OF function to Get Country And Category Data


function GetCountryAndCategoryData(TheCountry,TheCategory){



if(TheCountry != "*" && TheCategory != "*"){


    
        var CategoriesDataArray = [];
        jQuery.ajax({ 
            url: 'https://www.themealdb.com/api/json/v1/1/filter.php?c='+TheCategory, 
            type:'GET',
            async: false,
            success:function(data){
        
                CategoriesDataArray = data.meals;
                
            }
        });
    
        var CountriesDataArray = [];
        jQuery.ajax({ 
            url: 'https://www.themealdb.com/api/json/v1/1/filter.php?a='+TheCountry, 
            type:'GET',
            async: false,
            success:function(data){
        
                CountriesDataArray = data.meals;
                
            }
        });
    
    
        return searchAndFindCommons(CountriesDataArray,CategoriesDataArray)





}    else if (TheCountry == "*" && TheCategory != "*") {

    var allTheCountryDataFromAsingleCategory = [];
    jQuery.ajax({ 
        url: 'https://www.themealdb.com/api/json/v1/1/filter.php?c='+TheCategory, 
        type:'GET',
        async: false,
        success:function(data){
    
            allTheCountryDataFromAsingleCategory = data.meals;
            
        }
    });



    return allTheCountryDataFromAsingleCategory;




}   else if (TheCountry != "*" && TheCategory == "*") {

    var allTheCategoriesDataForAsingleCountry = [];
    jQuery.ajax({ 
        url: 'https://www.themealdb.com/api/json/v1/1/filter.php?a='+TheCountry, 
        type:'GET',
        async: false,
        success:function(data){
    
            allTheCategoriesDataForAsingleCountry = data.meals;
            console.log(allTheCategoriesDataForAsingleCountry)
        }
    });



    return allTheCategoriesDataForAsingleCountry;

    

} else if (TheCountry == "*" && TheCategory == "*") {


   // go get all the available Data we have two methods
   // 1 get list of all the countries then get every country data and merge / combine all the data inside one array
   // 2 get list of all the categories then get every category data and merge / combine all the data inside one array
   // i will use all categories because they are less than the countries so less http requests less loops

   AllCategoriesAndCountries = [];


for (const key in categoriesData) {

    jQuery.ajax({ 
        url: 'https://www.themealdb.com/api/json/v1/1/filter.php?c='+categoriesData[key].strCategory, 
        type:'GET',
        async: false,
        success:function(data){
    
            AllCategoriesAndCountries.push(data.meals);
            
        }
    });

}




return AllCategoriesAndCountries.flat(1) ;


} 







}


// END OF function to Get Country And Category Data



// START OF function THAT RETUN AN ARRAY CONTAINING Commons ITEMS


function searchAndFindCommons( array1 , array2 ){

    let MergedData = [];
    MergedData.length = 0;
    array1.forEach((Array1index) => {
    
    
    
        array2.forEach((Array2index) => {
    
    
        
            if(Number(Array1index.idMeal) == Number(Array2index.idMeal) ){
                MergedData.push(Array1index);
                
                
            }
        
    
        });
    
    
    });
    
    return MergedData;
    
    }


// END OF function THAT RETUN AN ARRAY CONTAINING Commons ITEMS

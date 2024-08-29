$(".fa-list").on("click",()=>{
    
  if($(".options").hasClass("displayhidden")) {
    $(".options").removeClass("displayhidden");
  } else{
    $(".options").addClass("displayhidden");
  }
})
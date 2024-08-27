document.querySelectorAll('img').forEach((image)=>{
    image.addEventListener("click",()=>{
      const {id}=image.dataset;
      window.location.href =`/carz/view/${id}`;
    })
  });

  //$(".alert").alert('close');
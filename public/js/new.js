

// $("input").on("keypress", function() {
//     $(this).css("border", "2px solid green");
// });

(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          console.log(form);
        }
        console.log(form);
        form.classList.add('was-validated')
      }, false)
    })
  })();


// (function() {
//     'use strict';
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.querySelectorAll('.needs-validation');

//     // Loop over them and prevent submission
//     Array.prototype.slice.call(forms)
//         .forEach(function(form) {
//             form.addEventListener('submit', function(event) {
//                 if (!form.checkValidity()) {
//                     event.preventDefault();
//                     event.stopPropagation();
//                 }

//                 form.classList.add('was-validated');
//             }, false);
//         });
// })();
let profil
let estSoumis

$(function () {
    $(".contenu").hide()
    $(".titre").click
    $(".titre").on("click", function () {
        $(".contenu").hide(1000)
       
        $( ".inner" ).after( "<p>Test</p>" );
        $( "<p>Test</p>" ).insertAfter( ".inner" );
       
        $(this).parent().find(".contenu").show(1000)
        $(this).append(`<p>PHILIPPE</p>`)
        allo()
    })
})

function allo(){
    
}



$("#formulaire").validate(
    {
        rules:{
            prenom:
            {required: true,
            maxlength: 100,
            alphanumeric:true
        },
        date:{
            required: true,
            datePlusPetite: true,
       

        }
        },
        messages:{
            prenom: {
            required:"Le prénom est obligatoire",
            maxlength:"Le nom ne peut pas être plus long que ..."
        },
        date:{
            required:"La date est requise",

            }
        },
        submitHandler:function(){
            //aller chercher les valeur du formulaire
            //SauvegarderDonnes()
           // CacherFormulaire()
           //profil = ObtenirProfil()
            CreerQuiz()
        },
        showErrors: function (errorMap, errorList) {
            if (estSoumis) {
                const ul = $("<ul></ul>");
                $.each(errorList, function () {
                  ul.append(`<li>${this.message}</li>`);
                });
                $('#afficherErreurs').html(ul)
                estSoumis = false;
              }
              this.defaultShowErrors();
        },
        invalidHandler: function (form, validator) {
            estSoumis = true;
        },
    }
)



function CreerQuiz(){
    
}

jQuery.validator.addMethod(
    "alphanumeric",
    function (value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
    },
    "Lettre,"
)
    

$.validator.addMethod(
    "datePlusPetite",
        function (value, element) {

      const dateActuelle = new Date();return this.optional(element) || dateActuelle >= new Date(value);
    },
    "La date de naissance doit être inférieure à la date d'aujourd'hui"

  );